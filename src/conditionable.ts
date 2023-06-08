import { Comparator, VerboseType } from "./common";
import { ConditionExpression } from "./condition";

export abstract class Conditionable {
  private conditionExpression = new ConditionExpression();

  static isntEmpty(map: { [key: string]: any }): boolean { return map && Object.keys(map).length !== 0; }

  condition(key: string, comparator: Comparator, value: any) { this.conditionExpression.compare(key, comparator, value); return this; }
  conditionExists(key: string) { this.conditionExpression.exists(key); return this; }
  conditionNotExists(key: string) { this.conditionExpression.notExists(key); return this; }
  conditionType(key: string, type: VerboseType) { this.conditionExpression.type(key, type); return this; }
  conditionBeginsWith(key: string, value: any) { this.conditionExpression.beginsWith(key, value); return this; }
  conditionContains(key: string, value: any) { this.conditionExpression.contains(key, value); return this; }
  conditionSize(key: string, comparator: Comparator, value: any) { this.conditionExpression.size(key, comparator, value); return this; }
  conditionBetween(key: string, value1: any, value2: any) { this.conditionExpression.between(key, value1, value2); return this; }
  conditionIn(key: string, values: any[]) { this.conditionExpression.in(key, values); return this; }

  /** applies the NOT logical evaluation operator to the next condition */
  not() { this.conditionExpression.not(); return this; }
  /** applies the OR logical evaluation operator to the next condition */
  or() { this.conditionExpression.or(); return this; }

  build() {
    const base: any = {}

    if (!this.conditionExpression.isEmpty()) base.ConditionExpression = this.conditionExpression.expression;
    if (Conditionable.isntEmpty(this.conditionExpression.names)) base.ExpressionAttributeNames = { ...this.conditionExpression.names }
    if (Conditionable.isntEmpty(this.conditionExpression.values)) base.ExpressionAttributeValues = { ...this.conditionExpression.values}

    return base;
  }
}
