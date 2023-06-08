import { ReturnConsumedCapacity } from "./common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ProjectionExpressable } from "./projection-expressable";

export abstract class Read extends ProjectionExpressable {
  consistentRead?: boolean = undefined;
  returnConsumedCapacity?: ReturnConsumedCapacity = undefined;

  protected _client: DynamoDBClient | undefined;
  client(client: DynamoDBClient) { this._client = client; return this; }
  abstract run(): Promise<any>

  constructor(private tableName: string) { super() }

  build(): any {
    const base: any = { TableName: this.tableName };
    if (this.consistentRead !== undefined) { base.ConsistentRead = this.consistentRead; }
    if (this.returnConsumedCapacity !== undefined) { base.ReturnConsumedCapacity = this.returnConsumedCapacity; }
    super.applyProjectionExpression(base);
    return base;
  }
}
