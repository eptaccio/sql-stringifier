var assert = require('assert');
const sqlStringifier = require('sql-stringifier');

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