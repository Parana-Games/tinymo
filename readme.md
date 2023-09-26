<p align="center">
  <img src="https://raw.githubusercontent.com/Parana-Games/tinymo/main/docs/logo.png">
</p>

[![test](https://github.com/Parana-Games/tinymo/actions/workflows/test.yml/badge.svg)](https://github.com/Parana-Games/tinymo/actions/workflows/test.yml)

**tinymo** simplifies constructing DynamoDB's JSON-based command inputs.

# From this:
```typescript
const update = {
  TableName: 'users',
  Key: { 
    id: 'bob' 
  },
  UpdateExpression: 'SET #orders :orders',
  ConditionExpression: '#age >= :ageCondition',
  ExpressionAttributeNames: { 
    '#age': 'age', 
    '#orders': 'orders' 
  },
  ExpressionAttributeValues: { 
    ':ageCondition': 18, 
    ':orders': 5
  }
}
...
```
# To this:
```typescript
await tinymo.update('users', { id: 'bob' }).set('orders', 5).condition('age', '>=', 18).run();
```

# Installation
```
npm i @parana-games/tinymo
```
# How to Use
1. Import:
```typescript
import { tinymo } from '@parana-games/tinymo';
```
2. Create requests:
> **tinymo** supports all of `DocumentClient`'s requests:
```typescript
const update = tinymo.update('table', { name: 'John' })
const put = tinymo.put('table', someItem)
const deleteRequest = tinymo.delete('table', { id: 1 })
const get = tinymo.get('table', { id: 'id' })
const batchGet = tinymo.batchGet()
const batchWrite = tinymo.batchWrite()
const query = tinymo.query('table')
const scan = tinymo.scan('table')
const transactGet = tinymo.transactGet()
const transaction = tinymo.transaction()
```
3. Customize requests:
> Request options are accessed through members of the class:
```typescript
get.attributes('id', 'name')

query.key('sk', '>=', 'order#100').filter('type', '=', 'refund')

scan.consistentRead = true

update.returnValues = 'ALL_NEW'
```
4. Execute with `.run()`:
> Every request is executable with `run()`
```typescript
await transaction.run()

const queryResponse = await query.run()

const batchGetResponse = await batchGet.run()

Promise.all([put, update, deleteRequest].map(request => request.run()));
```
# Transactions
**There are two ways of adding writes to a transaction:**
1. Using the `update`, `put` and `delete` methods:
>These methods add the corresponding write item to the list and return it, 
>so you can manipulate and pass it around with ease.
```typescript
const update = transaction.update('users', { id: 'dan' })
update.add('balance', 10);

transaction.put('users', { id: 'john', balance: 20 });
transaction.delete('orders', { id: '123' });
```

2. Using the `push` method, which accepts `Write` objects.
> `Write` is the base class of `Update`, `Put` and `Delete`. 
```typescript
const writes: Write[] = generateWrites(); 

// Sometimes you have just one update to make, so a transaction is overkill.
if (writes.length > 1) {
  await transaction.push(...writes).run();
} else (writes.length === 0) {
  await writes[0].run(); 
}
```
# Testability
Generate pure DynamoDB JSON-based command inputs with `build()`:
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


# Using without the tinymo Client
Send commands using your DynamoDBClient:
```typescript
import { Delete } from '@parana-games/tinymo';

const tinymoDelete = new Delete('users', { name: 'john' });
const command = new DeleteCommand(tinymoDelete.build());
const dynamoDBClient = new DynamoDBClient({});
await dynamoDBClient.send(command);
```
>️ Don't use run() when creating tinymo objects with new. They won't have an associated client.
```typescript
import { Scan } from '@parana-games/tinymo';

const scan = new Scan('users');
await scan.run(); // error thrown as this instance is clientless
```

## Use `TinymoClient.setDocumentClient` to set your own DocumentClient
```typescript
TinymoClient.setDocumentClient(myCustomDocumentClient); // Useful when using X-Ray!
```

# Documentation
tinymo aligns strictly with DynamoDB's API, so you can simply [refer to its documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html).

## Contributing
If you think we've missed something or can do something better, feel free opening an issue or submitting a pull request.
