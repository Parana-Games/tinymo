import { TransactGetItem as DynamoTransactGetItem, Get } from "@aws-sdk/client-dynamodb";
import { ProjectionExpressable } from "./projection-expressable";

export class TransactGetItem extends ProjectionExpressable {
  constructor(private tableName: string, private key: any) { super() }
  transact(): DynamoTransactGetItem { return { Get: this.build() } }

  build(): Get {
    const base: Get = { TableName: this.tableName, Key: this.key }
    this.applyProjectionExpression(base);
    return base;
  }
}