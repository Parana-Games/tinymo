import { GetCommand, GetCommandInput, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Read } from "./read";

export class Get extends Read {
  constructor(tableName: string, readonly key: any) { super(tableName); }
  build(): GetCommandInput { return { ...super.build(), Key: this.key } }
  async run(): Promise<GetCommandOutput> { return await this._client!.send(new GetCommand(this.build())); }
}