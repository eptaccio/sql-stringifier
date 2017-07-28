# sql-stringifier

sql-stringifier converts javascript arrays to correct sql queries.

[![Version npm](https://img.shields.io/npm/v/sql-stringifier.svg)](https://www.npmjs.com/package/sql-stringifier)

## Installing

```
npm install sql-stringifier
```

## Features

  * Auto escaping query values

## API

API is a subset of MongoDB's but without a **$** at the beginning.

#### Available operators
- `gt` - selects those rows where the value of the field is greater than the specified value.
- `gte` - selects the rows where the value of the field is greater than or equal to a specified value.
- `lt` - selects the rows where the value of the field is less than the specified value.
- `lte` - selects the rows where the value of the field is less than or equal to the specified value.
- `like` - SQL LIKE Operator
- `regexp` - SQL REGEXP Operator

## Usage examples

### Select data

```js
const sqlStringifier = require('sql-stringifier');

sqlStringifier.stringify({
    table: 'users',
    select: ['name', 'age'],
    where: {
        name: 'John',
        age: {
            gt: 18
        }
    }
});

// SELECT `name`, `age` FROM `users` WHERE `name` = 'John' AND `age` <= 18;
```

### Insert data

```js
const sqlStringifier = require('sql-stringifier');

sqlStringifier.stringify({
    table: 'users',
    insert: {
        values: {
            name: 'John',
            age: 21
        }
    }
});

// INSERT INTO `users` (`name`, `age`) VALUES ('John', 21);
```
### Update data

```js
const sqlStringifier = require('sql-stringifier');

sqlStringifier.stringify({
    table: 'users',
    update: {
        age: 18,
    },
    where: {
        id: 10
    }
});

// UPDATE `users` SET `age` = 18 WHERE `id` = 10;
```

### Delete data

```js
const sqlStringifier = require('sql-stringifier');

sqlStringifier.stringify({
    table: 'users',
    delete: {
        where: {
            name: 'John'
        }
    }
});

// DELETE FROM `users` WHERE `name` = 'John';
```

### Error handling

```js
const sqlStringifier = require('sql-stringifier');

try {
    sqlStringifier.stringify({
        insert: {
            values: {
                name: 'John',
                age: 21
            }
        }
    });
} catch (error) {
    /* handle error */
}
```