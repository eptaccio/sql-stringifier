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
		default:
			throw new Error('Type error: ' + value);
			break;
	}

}

function join(array, delimiter) {
	var result = '';
	if (!delimiter) delimiter = '`';
	array.forEach(function(item) {
		if (result) {
			result += ', ' + delimiter + item + delimiter;
		} else {
			result += delimiter + item + delimiter;
		}
	});
	return result;
}

function type(input) {
	switch (Object.prototype.toString.call(input)) {
		case '[object Array]':
			return 'array';
			break;
		case '[object Object]':
			return 'object';
			break;
		default:
			return typeof input;
			break;
	}
}


var main = {

	stringify: function(object) {

		var config = {};

		if (type(object) !== 'object') throw Error('First parameter should be an object');
		if (typeof object.table !== 'string') throw Error('Table is not defined');

		if (object.select) {

			config.result = 'SELECT ' + (type(object.select) === 'array' ? join(object.select) : (typeof object.select === 'string' ? object.select : '*')) + ' FROM `' + object.table + '`';
			config.type = 'select';

		} else if (object.insert) {

			if (type(object.insert.values) !== 'object') {
				throw Error('INSERT is not an object');
			}

			config.result = 'INSERT INTO `' + object.table + '`';
			config.type = 'insert';

			var firstPart = '';
			var secondPart = '';

			for (var option in object.insert.values) {
				firstPart += (firstPart ? ', ' : '') + '`' + option + '`';
				secondPart += (secondPart ? ', ' : '') + print(object.insert.values[option]);
			}

			config.result += ' (' + firstPart + ') VALUES (' + secondPart + ')';

		} else if (object.update) {

			if (type(object.update) !== 'object') {
				throw Error('UPDATE is not an object');
			}

			config.result = 'UPDATE `' + object.table + '` SET';
			config.type = 'update';

			var set = [];

			for (var option in object.update) {
				set.push('`' + option + '` = ' + print(object.update[option]));
			}

			config.result += ' ' + set.join(', ');

		} else if (object.delete) {

			config.result = 'DELETE FROM `' + object.table + '`';
			config.type = 'delete';
			object.where = object.delete.where;

		} else {

			throw Error('SQL query is not defined');

		}

		if (['select', 'update', 'delete'].indexOf(config.type) > -1) {

			if (type(object.where) !== 'object') {

				throw Error('WHERE is not an object');
			}

			config.result += ' WHERE';

			config.once = false;

			for (var option in object.where) {

				switch (type(object.where[option])) {
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

									config.result += (config.once ? ' AND `' : ' `') + option + "` < " + print(object.where[option].lt);
									config.once = true;
									break;
								default:
									throw new Error('Type error: ' + option);
									break;
							}
						} else if (object.where[option].lte) {
							switch (typeof object.where[option].lte) {
								case 'string':
								case 'number':

									config.result += (config.once ? ' AND `' : ' `') + option + "` <= " + print(object.where[option].lte);
									config.once = true;
									break;
								default:
									throw new Error('Type error: ' + option);
									break;
							}
						}

						if (object.where[option].gt) {
							switch (typeof object.where[option].gt) {
								case 'string':
								case 'number':

									config.result += (config.once ? ' AND `' : ' `') + option + "` >= " + print(object.where[option].gt);
									config.once = true;
									break;
								default:
									throw new Error('Type error: ' + option);
									break;
							}
						} else if (object.where[option].gte) {
							switch (typeof object.where[option].gte) {
								case 'string':
								case 'number':

									config.result += (config.once ? ' AND `' : ' `') + option + "` >= " + print(object.where[option].gte);
									config.once = true;
									break;
								default:
									throw new Error('Type error: ' + option);
									break;
							}
						}

						if (object.where[option].like && typeof object.where[option].like === 'string') {

							config.result += (config.once ? ' AND `' : ' `') + option + "` LIKE " + print(object.where[option].like);
							config.once = true;

						}

						if (object.where[option].regexp && typeof object.where[option].regexp === 'string') {

							config.result += (config.once ? ' AND `' : ' `') + option + "` REGEXP " + print(object.where[option].regexp);
							config.once = true;

						}
						break;
					default:
						throw new Error('Type error: ' + option);
						break;
				}

			}

		}

		if (object.order && config.type === 'select') {

			var col = object.order.columns || object.order.column;

			var order = typeof col === 'string' ? col : (type(col) === 'array' ? join(col) : false);

			if (order && typeof object.order.sort === 'string') {

				config.result += ' ORDER BY ' + order + ' ' + object.order.sort;

			} else {
				throw Error('ORDER is defined with mistakes');
			}

		}

		if (type(object.limit) === 'array' && object.limit.length === 2) {
			config.result += ' LIMIT ' + object.limit[0] + ', ' + object.limit[1];
		}

		return config.result + ';';

	}

};

module.exports = main;