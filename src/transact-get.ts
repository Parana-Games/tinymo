import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { TransactGetCommand, TransactGetCommandInput, TransactGetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { ReturnConsumedCapacity } from "./common";
import { TransactGetItem } from "./transact-get-item";

export class TransactGet {
  private gets: TransactGetItem[] = [];
  public get length() { return this.gets.length; }
  returnConsumedCapacity?: ReturnConsumedCapacity

  constructor(private client: DynamoDBClient) { }

  push(...gets: TransactGetItem[]): TransactGet { this.gets.push(...gets); return this; }
  async run(): Promise<TransactGetCommandOutput> { return await this.client.send(new TransactGetCommand(this.build())); }

  get(tableName: string, key: any): TransactGetItem {
    const get = new TransactGetItem(tableName, key);
    this.push(get);
    return get;
  }

  build(): TransactGetCommandInput {
    const input = { TransactItems: this.gets.map(g => g.transact()) } as TransactGetCommandInput
    if (this.returnConsumedCapacity) input.ReturnConsumedCapacity = this.returnConsumedCapacity
    return input
  }
}

