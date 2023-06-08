import { TransactWriteItem, Put as DynamoPut } from "@aws-sdk/client-dynamodb";
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Write } from "./write";

export class Put extends Write {
  constructor(tableName: string, readonly itemToPut: any) { super(tableName,); }
  transactWriteItem(): TransactWriteItem { return { Put: this.build() as DynamoPut }; }
  async run(): Promise<PutCommandOutput> { return await this._client!.send(new PutCommand(this.build())); }
  build(): DynamoPut { return { ...super.build(), Item: this.itemToPut }; }
}
