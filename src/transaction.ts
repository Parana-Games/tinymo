import { Delete } from './delete';
import { Put } from './put';
import { Update } from './update';
import { DynamoDBDocumentClient, TransactWriteCommand, TransactWriteCommandInput, TransactWriteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { ConditionCheck } from './condition-check';
import { ReturnConsumedCapacity, ReturnItemCollectionMetrics, TransactWritable } from './common';

export class Transaction {
  returnConsumedCapacity?: ReturnConsumedCapacity = undefined;
  returnItemCollectionMetrics?: ReturnItemCollectionMetrics = undefined;
  clientRequestToken?: string = undefined;
  private transactWriteItems: TransactWritable[] = [];

  public get length() { return this.transactWriteItems.length; }
  public isEmpty() { return this.length === 0; }

  constructor(private client: DynamoDBDocumentClient) { }

  push(...transactable: TransactWritable[]): Transaction { this.transactWriteItems.push(...transactable); return this; }
  async run(): Promise<TransactWriteCommandOutput> { return await this.client.send(new TransactWriteCommand(this.build())); }

  put(tableName: string, item: any): Put {
    const put = new Put(tableName, item).client(this.client);
    this.push(put);
    return put;
  }

  update(tableName: string, key: any): Update {
    const update = new Update(tableName, key).client(this.client);
    this.push(update);
    return update;
  }

  delete(tableName: string, key: any): Delete {
    const d = new Delete(tableName, key).client(this.client);
    this.push(d);
    return d;
  }

  conditionCheck(tableName: string, key: any): ConditionCheck {
    const conditionCheck = new ConditionCheck(tableName, key);
    this.push(conditionCheck);
    return conditionCheck;
  }

  build(): TransactWriteCommandInput {
    const input: TransactWriteCommandInput = { TransactItems: this.transactWriteItems.map((item) => item.transactWriteItem()) };
    if (this.returnConsumedCapacity !== undefined) input.ReturnConsumedCapacity = this.returnConsumedCapacity;
    if (this.returnItemCollectionMetrics !== undefined) input.ReturnItemCollectionMetrics = this.returnItemCollectionMetrics;
    if (this.clientRequestToken !== undefined) input.ClientRequestToken = this.clientRequestToken;
    return input;
  }
}
