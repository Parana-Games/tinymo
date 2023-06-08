import { Comparator, VerboseType } from './common';
import { ExpressionBuilder } from './expression';

export class ConditionExpression extends ExpressionBuilder {
  currentSeparator: string;
  tempSeparator?: string;
  shouldAppendNOT: boolean = false;

  public get expression(): string { return this._expression.trim().slice(this.currentSeparator.length).trim(); }
  appendToExpression(expression: string) { this._expression += this.getSeparator() + ' ' + this.getNOT() + expression; }
  constructor() { super(' AND'); this.currentSeparator = ' AND'; }

  exists(name: string) { this.pair(name, undefined, (n) => { return `attribute_exists(${n})`; }); }
  notExists(name: string) { this.pair(name, undefined, (n) => { return `attribute_not_exists(${n})`; }); }
  type(name: string, type: VerboseType) { this.pair(name, undefined, (n) => { return `attribute_type(${n}, ${ConditionExpression.dynamoTypeString(type)})`; }); }
  beginsWith(name: string, value: string) { this.pair(name, value, (n, v) => { return `begins_with(${n}, ${v})`; }, 'BeginsWithConditionValue'); }
  contains(name: string, value: string) { this.pair(name, value, (n, v) => { return `contains(${n}, ${v})`; }, 'ContainsConditionValue'); }

  compare(name: string, comparator: Comparator, value: any) {
    const suffix = ConditionExpression.suffixForComparator(comparator);
    this.pair(name, value, (n, v) => { return `${n} ${comparator} ${v}`; }, suffix);
    return this;
  }

  size(name: string, comparator: Comparator, value: any) {
    const suffix = 'Size' + ConditionExpression.suffixForComparator(comparator);
    this.pair(name, value, (n, v) => { return `size(${n}) ${comparator} ${v}`; }, suffix);
  }

  between(name: string, lower: any, upper: any) {
    const upperValue = this.addValue(name, upper, 'Upper');
    this.pair(name, lower, (n, lowerName) => { return `${n} BETWEEN ${lowerName} AND ${upperValue}`; }, 'Lower');
  }

  in(name: string, values: any[]) {
    const valueTokens = values.map((v, i) => this.addValue(name + 'InConditionValue' + i, v));
    const keyToken = this.addName(name);
    this.appendToExpression(`${keyToken} IN (${valueTokens.join(', ')})`);
  }

  private getNOT() {
    if (this.shouldAppendNOT) {
      this.shouldAppendNOT = false;
      return 'NOT ';
    }

    return '';
  }

  private getSeparator(): string {
    if (this.tempSeparator) {
      this.currentSeparator = this.tempSeparator;
      this.tempSeparator = undefined;
      return this.currentSeparator;
    }

    this.currentSeparator = this.separator;
    return this.currentSeparator;
  }

  not() {
    this.shouldAppendNOT = true;
    return this;
  }

  or() {
    this.tempSeparator = ' OR';
    return this;
  }

  static suffixForComparator(comparator: Comparator) {
    switch (comparator) {
      case '=': return 'EqualsConditionValue';
      case '<>': return 'NotEqualsConditionValue';
      case '<': return 'LessThanConditionValue';
      case '<=': return 'LessThanOrEqualsConditionValue';
      case '>': return 'GreaterThanConditionValue';
      case '>=': return 'GreaterThanOrEqualsConditionValue';
    }
  }

  static dynamoTypeString(type: VerboseType) {
    switch (type) {
      case 'String': return 'S';
      case 'String Set': return 'SS';
      case 'Number': return 'N';
      case 'Number Set': return 'NS';
      case 'Binary': return 'B';
      case 'Binary Set': return 'BS';
      case 'Boolean': return 'BOOL';
      case 'Null': return 'NULL';
      case 'List': return 'L';
      case 'Map': return 'M';
    }
  }
}