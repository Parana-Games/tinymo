import { ExpressionBuilder, ExpressionStringFormatter } from "./expression";

export abstract class ProjectionExpressable {
  protected projectionExpression = new ExpressionBuilder(",");

  attributes(...attributes: string[]) {
    const formatter: ExpressionStringFormatter = (n) => { return n; };
    attributes.forEach((attribute) => this.projectionExpression.pair(attribute, undefined, formatter));
    return this;
  }

  protected applyProjectionExpression(base: any) {
    if (!this.projectionExpression.isEmpty()) {
      base.ProjectionExpression = this.projectionExpression.expression;
      base.ExpressionAttributeNames = { ...this.projectionExpression.names };
    }
  }
}