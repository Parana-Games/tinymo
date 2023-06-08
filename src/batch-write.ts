import { Delete } from './delete';
import { Put } from './put';
import { DynamoDBClient, } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { WriteRequest } from '@aws-sdk/client-dynamodb';
import { ReturnConsumedCapacity, ReturnItemCollectionMetrics } from './common';

type BatchWritable = Put | Delete;

export class BatchWrite {
  private batchWriteItems: BatchWritable[] = [];
  returnConsumedCapacity?: ReturnConsumedCapacity
  returnItemCollectionMetrics?: ReturnItemCollectionMetrics

  public get items() { return this.batchWriteItems; }
  public get length() { return this.batchWriteItems.length; }

  constructor(private client: DynamoDBClient) { }

  push(...writes: BatchWritable[]): BatchWrite { this.batchWriteItems.push(...writes); return this; }
  async run(): Promise<BatchWriteCommandOutput> { return await this.client.send(new BatchWriteCommand(this.build())); }

  put(tableName: string, item: any) {
    const put = new Put(tableName, item).client(this.client);
    this.push(put);
  }

  delete(tableName: string, key: any) {
    const d = new Delete(tableName, key).client(this.client);
    this.push(d);
  }

  build(): BatchWriteCommandInput {
    const puts = this.batchWriteItems.filter((p): p is Put => p instanceof Put)
    const deletes = this.batchWriteItems.filter((p): p is Delete => p instanceof Delete)
    const tableNames = [...puts, ...deletes].map(p => p.tableName).filter((v, i, a) => a.indexOf(v) === i)

    const input: BatchWriteCommandInput = {
      RequestItems: tableNames.reduce((acc, tableName) => {
        const putRequests = puts.filter(p => p.tableName === tableName).map(p => { return { PutRequest: { Item: p.build().Item } } })
        const deleteRequests = deletes.filter(p => p.tableName === tableName).map(p => { return { DeleteRequest: { Key: p.key } } })
        acc[tableName] = [...putRequests, ...deleteRequests]
        return acc
      }, {} as { [key: string]: WriteRequest[] })
    }

    if (this.returnConsumedCapacity) input.ReturnConsumedCapacity = this.returnConsumedCapacity
    if (this.returnItemCollectionMetrics) input.ReturnItemCollectionMetrics = this.returnItemCollectionMetrics

    return input
  }
}