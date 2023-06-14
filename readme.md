<p align="center">
  <img src="https://raw.githubusercontent.com/Parana-Games/tinymo/main/docs/logo.png">
</p>

[![test](https://github.com/Parana-Games/tinymo/actions/workflows/test.yml/badge.svg)](https://github.com/Parana-Games/tinymo/actions/workflows/test.yml)

Constructing DynamoDB's JSON-based command inputs can get challenging.

**tinymo** is here to help!

# 😨
```typescript
const update = {
  TableName: 'users',
  Key: { 
    id: 'john' 
  },
  UpdateExpression: 'ADD #orders :orders',
  ConditionExpression: '#balance > :balanceCondition',
  ExpressionAttributeNames: { 
    '#balance': 'balance', 
    '#orders': 'orders' 
  },
  ExpressionAttributeValues: { 
    ':balanceCondition': 10, 
    ':orders': 1 
  }
}

```
# 😌
```typescript
const update = tinymo.update('users', { id: 'john' });
update.add('orders', 1);
update.condition('balance', '>', 10);
```

# Features
### Chaining!
```typescript
update.set('name', 'John').add('age', 30).remove('address');
```
### Transactions!
```typescript
const transaction = tinymo.transaction();

transaction.delete('users', { pk: 'jeff', id: 'order#001' });
transaction.update('stores', { id: 'amazon' }).add('balance', 1);
```
### Batch writes!
```typescript
const batchWrite = tinymo.batchWrite();

batchWrite.delete('stores', { id: '123' });
batchWrite.put('users', { name: 'jeff' });
```
and all of `DocumentClient`'s features!
# Installation
```
npm i @parana-games/tinymo
```
# Setup
```typescript
import { TinymoClient } from '@parana-games/tinymo';
const tinymo = TinymoClient.default();
```
Optionally, set your own `DynamoDBClient`: 
```typescript
TinymoClient.setDynamoDBClient(new DynamoDBClient({})); // Useful when using X-Ray!
```
# Usage
Create requests through the client:
```typescript
const put = tinymo.put('users', { id: '123', name: 'dan' });
const get = tinymo.get('games', { id: 'pool-stars' }).attributes('description');
const query = tinymo.query('users').keyBetween('sk', 'order#001', 'order#999');
```
Run requests: 
```typescript
await put.run()
const getResult = await get.run();
const queryResult = await query.run();
```
All tinymo requests are `run`-able, so you can do things like: 
```typescript
Promise.all([put, get, query].map(request => request.run()));
```
# Testability
Use `build()` on any tinymo object to output pure DynamoDB JSON-based command inputs:
```typescript
const put = tinymo.put('games', { name: 'pool-stars' });
put.build()
```
↓
```typescript
{
  'TableName': 'games',
  'Item': {
    'name': 'pool-stars'
  }
}
```
Useful for <sup><sub>tiny</sub></sup> unit tests!
# Usage without the tinymo client
You can also use `build()` when using your own `DynamoDBClient`:
```typescript
import { Delete } from '@parana-games/tinymo';

const tinymoDelete = new Delete('users', { name: 'john' });
const command = new DeleteCommand(tinymoDelete.build());
const dynamoDBClient = new DynamoDBClient({});
await dynamoDBClient.send(command);
```
But when creating tinymo's objects using `new`, avoid using `run()`!
```typescript
import { Scan } from '@parana-games/tinymo';

const scan = new Scan('users');
await scan.run(); // error thrown as this instance is clientless
``` 
# Documentation
tinymo aligns strictly with DynamoDB's API, so you can simply [refer to its documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html).

## Contributing
If you think we've missed something or can do something better, feel free opening an issue or submitting a pull request.
