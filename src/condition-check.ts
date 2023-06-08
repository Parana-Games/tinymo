import { ConditionCheck as DynamoConditionCheck, TransactWriteItem } from "@aws-sdk/client-dynamodb";
import { TransactWritable } from "./common";
import { Conditionable } from "./conditionable";

export class ConditionCheck extends Conditionable implements TransactWritable {
  returnValuesOnFailure?: 'ALL_OLD' | 'NONE';

  constructor(readonly tableName: string, readonly key: any) { super(); }
  transactWriteItem(): TransactWriteItem { return { ConditionCheck: this.build() }; }

  build(): DynamoConditionCheck {
    const conditionCheck = { ...super.build(), TableName: this.tableName, Key: this.key } as DynamoConditionCheck;
    if (this.returnValuesOnFailure) { conditionCheck.ReturnValuesOnConditionCheckFailure = this.returnValuesOnFailure; }
    return conditionCheck;
  }
}