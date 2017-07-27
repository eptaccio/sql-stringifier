'use strict';

var SqlString = require('sqlstring');

function print(value) {

    switch (typeof value) {
        case 'string':
            return SqlString.escape(value);
            break;
        case 'number':
            return value;
            break;
    }
}

var main = module.exports = {

    stringify: function(object) {

        var config = {};

        if (typeof object !== 'object') return Error('First parameter should be an object');
        if (typeof object.table !== 'string') return Error('Table is not defined');

        if (object.select) {
            config.result = 'SELECT ' + (typeof object.select === 'object' ? object.select.join(',') : (object.select ? object.select : '*')) + ' FROM `' + object.table + '`';
            config.type = 'select';
        } else if (object.insert) {
            config.result = 'INSERT INTO `' + object.table + '`';
            config.type = 'insert';
        }

        if (config.type === 'insert') {
            var firstPart = '';
            var secondPart = '';

            for (var option in object.insert.values) {
                firstPart += (firstPart ? ', ' : '') + '`' + option + '`';
                secondPart += (secondPart ? ', ' : '') + print(object.insert.values[option]);
            }
            config.result += ' (' + firstPart + ') VALUES (' + secondPart + ')';
        }

        if (['select', 'update', 'delete'].indexOf(config.type) > -1 && object.where && typeof object.where === 'object') {

            config.result += ' WHERE';

            config.once = false;

            for (var option in object.where) {

                switch (typeof object.where[option]) {
                    case 'string':
                    case 'number':


                        config.result += (config.once ? ' AND `' : ' `') + option + "` = " + print(object.where[option]);
                        config.once = true;

                        break;


                    case 'object':

                        if (object.where[option].lt) {
                            switch (typeof object.where[option].lt) {
                                case 'string':
                                case 'number':

                                    config.result += (config.once ? ' AND `' : ' `') + option + "` > " + print(object.where[option].lt);
                                    config.once = true;
                                    break;
                            }
                        } else if (object.where[option].lte) {
                            switch (typeof object.where[option].lte) {
                                case 'string':
                                case 'number':

                                    config.result += (config.once ? ' AND `' : ' `') + option + "` >= " + print(object.where[option].lte);
                                    config.once = true;
                                    break;
                            }
                        }

                        if (object.where[option].gt) {
                            switch (typeof object.where[option].gt) {
                                case 'string':
                                case 'number':

                                    config.result += (config.once ? ' AND `' : ' `') + option + "` <= " + print(object.where[option].gt);
                                    config.once = true;
                                    break;
                            }
                        } else if (object.where[option].gte) {
                            switch (typeof object.where[option].gte) {
                                case 'string':
                                case 'number':

                                    config.result += (config.once ? ' AND `' : ' `') + option + "` <= " + print(object.where[option].gte);
                                    config.once = true;
                                    break;
                            }
                        }

                        if (object.where[option].like) {
                            if (typeof object.where[option].like === 'string') {



                                config.result += (config.once ? ' AND `' : ' `') + option + "` LIKE " + print(object.where[option].like);
                                config.once = true;

                            }
                        }

                        if (object.where[option].regexp) {
                            if (typeof object.where[option].regexp === 'string') {



                                config.result += (config.once ? ' AND `' : ' `') + option + "` REGEXP " + print(object.where[option].regexp);
                                config.once = true;

                            }
                        }



                        break;
                }

            }

        }

        return config.result + ';';

    }
};