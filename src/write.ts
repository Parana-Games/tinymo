import { ReturnConsumedCapacity, ReturnItemCollectionMetrics, TransactWritable, } from "./common";
import { TransactWriteItem } from "@aws-sdk/client-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Conditionable } from "./conditionable";

export type ReturnValue = | "NONE" | "ALL_OLD" | "UPDATED_OLD" | "ALL_NEW" | "UPDATED_NEW";

/** An abstract base class containing the common functionality for all DynamoDB write operations */
export abstract class Write extends Conditionable implements TransactWritable {
  returnValues?: ReturnValue;
  returnConsumedCapacity?: ReturnConsumedCapacity = undefined;
  returnItemCollectionMetrics?: ReturnItemCollectionMetrics = undefined;

  protected _client: DynamoDBClient | undefined;
  client(client: DynamoDBClient) { this._client = client; return this; }
  abstract run(): Promise<any>

  constructor(readonly tableName: string) { super() }

  abstract transactWriteItem(): TransactWriteItem;

  build() {
    const write: any = { ...super.build(), TableName: this.tableName };
    if (this.returnConsumedCapacity !== undefined) write.ReturnConsumedCapacity = this.returnConsumedCapacity;
    if (this.returnItemCollectionMetrics !== undefined) write.ReturnItemCollectionMetrics = this.returnItemCollectionMetrics;
    if (this.returnValues !== undefined) write.ReturnValues = this.returnValues;
    return write;
  }
}
