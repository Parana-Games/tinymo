import { TransactWriteItem, DeleteItemInput } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DeleteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Write } from "./write";

export class Delete extends Write {
  constructor(tableName: string, readonly key: any) { super(tableName); }
  transactWriteItem(): TransactWriteItem { return { Delete: this.build() }; }
  build(): DeleteItemInput { return { ...super.build(), TableName: this.tableName, Key: this.key }; }
  async run(): Promise<DeleteCommandOutput> { return await this._client!.send(new DeleteCommand(this.build())); }
}
