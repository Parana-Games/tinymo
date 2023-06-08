import { BatchGetCommand, BatchGetCommandInput, BatchGetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { KeysAndAttributes } from "@aws-sdk/client-dynamodb";
import { ReturnConsumedCapacity } from "./common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ProjectionExpressable } from "./projection-expressable";

export class Keys extends ProjectionExpressable {
  consistentRead?: boolean = undefined;
  returnConsumedCapacity?: ReturnConsumedCapacity = undefined;

  constructor(readonly tableName: string, private keys: Record<string, any>[]) { super() }

  key(...key: Record<string, any>[]) { this.keys.push(...key); }

  build(): KeysAndAttributes {
    const base = { Keys: this.keys } as KeysAndAttributes;
    if (this.consistentRead !== undefined) { base.ConsistentRead = this.consistentRead; }
    super.applyProjectionExpression(base);
    return base;
  }
}

export class BatchGet {
  constructor(private client?: DynamoDBClient) { }

  private requestItems: Keys[] = [];

  get(tableName: string, keys: any[]): Keys {
    const existing = this.requestItems.find((request) => request.tableName === tableName);
    if (existing) { 
      existing.key(...keys);
      return existing;
    }

    const request = new Keys(tableName, keys);
    this.requestItems.push(request);
    return request;
  }

  build(): BatchGetCommandInput {
    return {
      RequestItems: this.requestItems.reduce((acc, batchGet) => {
        acc[batchGet.tableName] = batchGet.build();
        return acc;
      }, {} as { [key: string]: KeysAndAttributes })
    };
  }

  async run(): Promise<BatchGetCommandOutput> { return await this.client!.send(new BatchGetCommand(this.build())); }
}