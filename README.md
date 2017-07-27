# sql-stringifier

sql-stringifier was made to allow you make fast and secure sql requests.

## Installing

```
npm install sql-stringifier
```

## API

API is a subset of MongoDB's but without a **$** at the beginning.

##### Available operators
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

// SELECT name,age FROM `users` WHERE `name` = 'John' AND `age` <= 18;
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