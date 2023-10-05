export type ExpressionStringFormatter = (nameKey: string, valueKey?: string) => string;

export class ExpressionBuilder {
  protected _expression = "";
  public get expression(): string { return this._expression.trim().slice(0, -this.separator.length); }

  readonly values: Record<string, any> = {};
  readonly names: Record<string, any> = {};

  constructor(public separator: string) { }

  appendToExpression(expression: string) { this._expression += " " + expression + this.separator; }
  isEmpty(): boolean { return this.expression.length === 0; }

  pair(name: string, value: any, formatter?: ExpressionStringFormatter, valueNameSuffix: string = "") {
    const nameToken = this.addName(name);
    const valueToken = value !== undefined ? this.addValue(name, value, valueNameSuffix) : undefined;

    if (formatter) {
      const expressionAddition = formatter(nameToken, valueToken);
      if (expressionAddition.length > 0) this.appendToExpression(expressionAddition);
    }
  }

  addValue(name: string, value: any, valueNameSuffix: string = ""): string {
    let valueToken = `:${this.replaceAll(name, ".", "")}${valueNameSuffix}`;
    if (this.values[valueToken]) valueToken += Object.keys(this.values).filter((k) => k.startsWith(valueToken)).length + 1;
    this.values[valueToken] = value;
    return valueToken;
  }

  addName(name: string): string {
    const nameTokens = name.split(".");
    nameTokens.forEach((n) => (this.names[`#${n}`] = n));
    return "#" + nameTokens.reduce((a, b) => `${a}` + `.#${b}`);
  }

  private replaceAll(input: string, find: string, replace: string) { return input.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), replace); }
}