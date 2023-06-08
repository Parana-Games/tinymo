import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { Update } from './update';
import { Put } from './put';
import { Delete } from './delete';

import { Get } from './get';
import { Query } from './query';
import { Scan } from './scan';
import { Transaction } from './transaction';

import { BatchGet } from './batch-get';
import { BatchWrite } from './batch-write';
import { TransactGet } from './transact-get';

let DYNAMODB_CLIENT: DynamoDBClient;
let TINYMO_CLIENT: TinymoClient;

export class TinymoClient {
  private constructor(readonly client: DynamoDBClient) { }

  static setDynamoDBClient(client?: DynamoDBClient) {
    DYNAMODB_CLIENT = client ?? new DynamoDBClient({});
    TINYMO_CLIENT = new TinymoClient(DYNAMODB_CLIENT);
  }

  static default(): TinymoClient {
    DYNAMODB_CLIENT = DYNAMODB_CLIENT ?? new DynamoDBClient({});
    TINYMO_CLIENT = TINYMO_CLIENT ?? new TinymoClient(DYNAMODB_CLIENT);
    return TINYMO_CLIENT;
  }

  put(tableName: string, item: any): Put { return new Put(tableName, item).client(DYNAMODB_CLIENT); }
  update(tableName: string, key: any): Update { return new Update(tableName, key).client(DYNAMODB_CLIENT); }
  delete(tableName: string, key: any): Delete { return new Delete(tableName, key).client(DYNAMODB_CLIENT); }
  get(tableName: string, key: any): Get { return new Get(tableName, key).client(DYNAMODB_CLIENT); }
  scan(tableName: string): Scan { return new Scan(tableName).client(DYNAMODB_CLIENT); }
  query(tableName: string): Query { return new Query(tableName).client(DYNAMODB_CLIENT); }
  batchGet(): BatchGet { return new BatchGet(DYNAMODB_CLIENT); }
  batchWrite(): BatchWrite { return new BatchWrite(DYNAMODB_CLIENT) } 
  transactGet(): TransactGet { return new TransactGet(DYNAMODB_CLIENT); }
  transaction(): Transaction { return new Transaction(DYNAMODB_CLIENT) }
}