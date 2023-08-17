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
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let DOCUMENT_CLIENT: DynamoDBDocumentClient;
let TINYMO_CLIENT: TinymoClient;


export class TinymoClient {
  private constructor(readonly client: DynamoDBDocumentClient) { }

  static setDocumentClient(client?: DynamoDBDocumentClient) {
    DOCUMENT_CLIENT = client ?? TinymoClient.createDefaultDocumentClient()
    TINYMO_CLIENT = new TinymoClient(DOCUMENT_CLIENT);
  }

  static default(): TinymoClient {
    DOCUMENT_CLIENT = DOCUMENT_CLIENT ?? TinymoClient.createDefaultDocumentClient()
    TINYMO_CLIENT = TINYMO_CLIENT ?? new TinymoClient(DOCUMENT_CLIENT);
    return TINYMO_CLIENT;
  }

  private static createDefaultDocumentClient() { 
    const marshallOptions = { convertEmptyValues: true, removeUndefinedValues: true, convertClassInstanceToMap: true };
    return DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions });    
  }

  put(tableName: string, item: any): Put { return new Put(tableName, item).client(DOCUMENT_CLIENT); }
  update(tableName: string, key: any): Update { return new Update(tableName, key).client(DOCUMENT_CLIENT); }
  delete(tableName: string, key: any): Delete { return new Delete(tableName, key).client(DOCUMENT_CLIENT); }
  get(tableName: string, key: any): Get { return new Get(tableName, key).client(DOCUMENT_CLIENT); }
  scan(tableName: string): Scan { return new Scan(tableName).client(DOCUMENT_CLIENT); }
  query(tableName: string): Query { return new Query(tableName).client(DOCUMENT_CLIENT); }
  batchGet(): BatchGet { return new BatchGet(DOCUMENT_CLIENT); }
  batchWrite(): BatchWrite { return new BatchWrite(DOCUMENT_CLIENT) }
  transactGet(): TransactGet { return new TransactGet(DOCUMENT_CLIENT); }
  transaction(): Transaction { return new Transaction(DOCUMENT_CLIENT) }
}