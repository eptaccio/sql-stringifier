var assert = require('assert');
const sqlStringifier = require('sql-stringifier');

describe('select data + ORDER BY + LIMIT', function() {
	it('should return the right select sql query', function() {
		var actual = sqlStringifier.stringify({
			table: 'users',
			select: ['name', 'age'],
			where: {
				name: 'John',
				age: {
					gt: 18
				}
			},
			order: {
				columns: ['name', 'age'],
				sort: 'ASC'
			},
			limit: [0, 10]
		});
		assert.equal(actual, "SELECT `name`, `age` FROM `users` WHERE `name` = 'John' AND `age` >= 18 ORDER BY `name`, `age` ASC LIMIT 0, 10;");
	});
});

describe('select data + ALL WHERE OPERATORS', function() {
	it('should return the right select sql query', function() {
		var actual = sqlStringifier.stringify({
			table: 'users',
			select: ['name', 'age'],
			where: {
				name: {
					like: '%John%'
				},
				age: {
					gt: 18,
					lt: 30
				},
				year: {
					gte: 1000,
					lte: 1000
				},
				surname: {
					regex: '//'
				}
			}
		});
		assert.equal(actual, "SELECT `name`, `age` FROM `users` WHERE `name` LIKE '%John%' AND `age` < 30 AND `age` >= 18 AND `year` <= 1000 AND `year` >= 1000;");
	});
});

describe('select data', function() {
	it('should return the right select sql query', function() {
		var actual = sqlStringifier.stringify({
			table: 'users',
			select: ['name', 'age'],
			where: {
				name: 'John',
				age: {
					gt: 18
				}
			}
		});
		assert.equal(actual, "SELECT `name`, `age` FROM `users` WHERE `name` = 'John' AND `age` >= 18;");
	});
});

describe('insert data', function() {
	it('should return the right insert sql query', function() {
		var actual = sqlStringifier.stringify({
			table: 'users',
			insert: {
				values: {
					name: 'John',
					age: 21
				}
			}
		});
		assert.equal(actual, "INSERT INTO `users` (`name`, `age`) VALUES ('John', 21);");
	});
});

describe('update data', function() {
	it('should return the right update sql query', function() {
		var actual = sqlStringifier.stringify({
			table: 'users',
			update: {
				age: 18,
			},
			where: {
				id: 10
			}
		});
		assert.equal(actual, "UPDATE `users` SET `age` = 18 WHERE `id` = 10;");
	});
});

describe('delete data', function() {
	it('should return the right dalete sql query', function() {
		var actual = sqlStringifier.stringify({
			table: 'users',
			delete: {
				where: {
					name: 'John'
				}
			}
		});

		assert.equal(actual, "DELETE FROM `users` WHERE `name` = 'John';");
	});
});

describe('catch error in WHERE', function() {
	it('should return an error', function() {
		var error = false;
		try {
			sqlStringifier.stringify({
				table: 'users',
				delete: {
					where: []
				}
			});
		} catch (e) {
			error = true;
		}
		assert.equal(error, true);
	});
});

describe('catch error in WHERE + OPERATORS', function() {
	it('should return an error', function() {
		var error = false;
		try {
			sqlStringifier.stringify({
				table: 'users',
				delete: {
					where: {
						lt: []
					}
				}
			});
		} catch (e) {
			error = true;
		}
		assert.equal(error, true);
	});
});

describe('catch error in ORDER', function() {
	it('should return an error', function() {
		var error = false;
		try {
			sqlStringifier.stringify({
				table: 'users',
				select: ['lol'],
				order: {
					columns: {}
				}
			});
		} catch (e) {
			error = true;
		}
		assert.equal(error, true);
	});
});

describe('catch error when sql query type is defined', function() {
	it('should return an error', function() {
		var error = false;
		try {
			sqlStringifier.stringify({
				table: 'users'
			});
		} catch (e) {
			error = true;
		}
		assert.equal(error, true);
	});
});