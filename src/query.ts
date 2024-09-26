import { QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { ConditionExpression } from './condition';
import { Search } from './search';

export type KeyComparator = '=' | '<' | '>' | '<=' | '>=';

export class Query extends Search {
  private keyCondition = new ConditionExpression();
  scanIndexForward?: boolean = undefined;

  keyBetween(path: string, lower: any, upper: any) { this.keyCondition.between(path, lower, upper); return this; }
  keyBeginsWith(name: string, value: any) { this.keyCondition.beginsWith(name, value); return this; }
  async run() { return await this._client!.send(new QueryCommand(this.build())); }

  key(name: string, comparator: KeyComparator, value: any) {
    const suffix = ConditionExpression.suffixForComparator(comparator);
    this.keyCondition.pair(name, value, (nameKey, valueKey) => { return `${nameKey} ${comparator} ${valueKey}`; }, suffix);
    return this;
  }

  build(): QueryCommandInput {
    const base: QueryCommandInput = super.build();
    if (this.scanIndexForward !== undefined) { base.ScanIndexForward = this.scanIndexForward; }
    if (!this.keyCondition.isEmpty()) {
      base.KeyConditionExpression = this.keyCondition.expression;
      base.ExpressionAttributeNames = { ...base.ExpressionAttributeNames, ...this.keyCondition.names, };
      base.ExpressionAttributeValues = { ...base.ExpressionAttributeValues, ...this.keyCondition.values, };
    }
    return base;
  }
}
