import { Select, Comparator, VerboseType } from "./common";
import { ConditionExpression } from "./condition";
import { Read } from "./read";

export abstract class Search extends Read {
  private filterExpression = new ConditionExpression();

  exclusiveStartKey?: any = undefined;
  indexName?: string = undefined;
  limit?: number = undefined;
  select?: Select = undefined;

  filter(key: string, comparator: Comparator, value: any) { this.filterExpression.compare(key, comparator, value); return this; }
  filterExists(key: string) { this.filterExpression.exists(key); return this; }
  filterNotExists(key: string) { this.filterExpression.notExists(key); return this; }
  filterType(key: string, type: VerboseType) { this.filterExpression.type(key, type); return this; }
  filterBeginsWith(key: string, value: any) { this.filterExpression.beginsWith(key, value); return this; }
  filterContains(key: string, value: any) { this.filterExpression.contains(key, value); return this; }
  filterSize(key: string, comparator: Comparator, value: any) { this.filterExpression.size(key, comparator, value); return this; }
  filterBetween(key: string, value1: any, value2: any) { this.filterExpression.between(key, value1, value2); return this; }
  filterIn(key: string, values: any[]) { this.filterExpression.in(key, values); return this; }

  build() {
    const base: any = super.build();

    if (this.select !== undefined) { base.Select = this.select; }
    if (this.indexName !== undefined) { base.IndexName = this.indexName; }
    if (this.exclusiveStartKey !== undefined) { base.ExclusiveStartKey = this.exclusiveStartKey; }
    if (this.limit !== undefined) { base.Limit = this.limit; }
    if (this.returnConsumedCapacity !== undefined) { base.ReturnConsumedCapacity = this.returnConsumedCapacity; }

    if (!this.filterExpression.isEmpty()) {
      base.FilterExpression = this.filterExpression.expression;
      base.ExpressionAttributeNames = { ...base.ExpressionAttributeNames, ...this.filterExpression.names, };
      base.ExpressionAttributeValues = { ...base.ExpressionAttributeValues, ...this.filterExpression.values, };
    }

    return base;
  }
}
