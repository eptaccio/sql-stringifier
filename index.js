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
			Error('Type error: ' + value);
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


var main = {

	stringify: function(object) {

		var config = {};

		if (typeof object !== 'object') return Error('First parameter should be an object');
		if (typeof object.table !== 'string') return Error('Table is not defined');

		if (object.select) {

			config.result = 'SELECT ' + (typeof object.select === 'object' ? join(object.select) : (object.select ? object.select : '*')) + ' FROM `' + object.table + '`';
			config.type = 'select';

		} else if (object.insert) {

			config.result = 'INSERT INTO `' + object.table + '`';
			config.type = 'insert';

		} else if (object.update) {

			config.result = 'UPDATE `' + object.table + '` SET';
			config.type = 'update';

		} else if (object.delete) {

			config.result = 'DELETE FROM `' + object.table + '`';
			config.type = 'delete';
			object.where = object.delete.where;

		}


		if (config.type === 'insert') {

			var firstPart = '';
			var secondPart = '';

			for (var option in object.insert.values) {
				firstPart += (firstPart ? ', ' : '') + '`' + option + '`';
				secondPart += (secondPart ? ', ' : '') + print(object.insert.values[option]);
			}

			config.result += ' (' + firstPart + ') VALUES (' + secondPart + ')';

		} else if (config.type === 'update') {
			var set = [];
			for (var option in object.update) {
				set.push('`' + option + '` = ' + print(object.update[option]));

			}


			config.result += ' ' + set.join(', ');

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

			var order = typeof col === 'string' ? col : (Array.isArray(col) ? join(col) : '');

			if (order) {

				config.result += ' ORDER BY ' + order + ' ' + object.order.sort;

			} else {
				return Error('Order is defined with errors');
			}

		}

		if (Array.isArray(object.limit) && object.limit.length === 2) {
			config.result += ' LIMIT ' + object.limit[0] + ', ' + object.limit[1];
		}

		return config.result + ';';

	}
};

module.exports = main;