import { TransactWriteItem, Update as TransactUpdate } from '@aws-sdk/client-dynamodb'
import { UpdateCommand, UpdateCommandInput, UpdateCommandOutput } from '@aws-sdk/lib-dynamodb'
import { ExpressionBuilder } from './expression'
import { Write } from './write'

export class Update extends Write {
  private addBuilder = new ExpressionBuilder(',')
  private setBuilder = new ExpressionBuilder(',')
  private removeBuilder = new ExpressionBuilder(',')
  private deleteBuilder = new ExpressionBuilder(',')

  constructor(tableName: string, readonly key: any) { super(tableName) }

  async run(): Promise<UpdateCommandOutput> { return await this._client!.send(new UpdateCommand(this.build())) }
  transactWriteItem(): TransactWriteItem { return { Update: this.build() as any as TransactUpdate } }

  isEmpty(): boolean { return this.setBuilder.isEmpty() && this.addBuilder.isEmpty() && this.removeBuilder.isEmpty() && this.deleteBuilder.isEmpty() }
  add(key: string, value: any): Update { this.addBuilder.pair(key, value, (n, v) => { return `${n} ${v}` }); return this; }
  subtract(key: string, value: any): Update { this.setBuilder.pair(key, value, (n, v) => { return `${n} = ${n} - ${v}` }); return this; }

  private buildUpdateExpression(): string {
    let result = ''

    result += this.setBuilder.isEmpty() ? '' : ' SET ' + this.setBuilder.expression
    result += this.addBuilder.isEmpty() ? '' : ' ADD ' + this.addBuilder.expression
    result += this.removeBuilder.isEmpty() ? '' : ' REMOVE ' + this.removeBuilder.expression
    result += this.deleteBuilder.isEmpty() ? '' : ' DELETE ' + this.deleteBuilder.expression

    return result.trim();
  }

  set(key: string, value: any, overwrite = true): Update {
    if (overwrite) {
      this.setBuilder.pair(key, value, (n, v) => `${n} = ${v}`)
    } else {
      this.setBuilder.pair(key, value, (n, v) => `${n} = if_not_exists(${n}, ${v})`)
    }

    return this
  }

  setListItem(key: string, index: number, value: any): Update {
    this.setBuilder.pair(key, value, (n, v) => { return `${n}[${index}] = ${v}` });
    return this;
  }

  remove(...keys: string[]): Update {
    keys.forEach(k => this.removeBuilder.pair(k, undefined, (n) => { return `${n}` }));
    return this;
  }

  addToList(listName: string, value: any, createIfNotExists = true): Update {
    const flatArray = [value].flat()

    if (createIfNotExists) {
      const valueToken = this.setBuilder.addValue(`newList`, [])
      this.setBuilder.pair(listName, flatArray, (n, v) => `${n} = list_append(if_not_exists(${n}, ${valueToken}), ${v})`)
    } else {
      this.setBuilder.pair(listName, flatArray, (n, v) => `${n} = list_append(${n}, ${v})`)
    }

    return this
  }

  removeIndexFromList(listName: string, index: number): Update {
    this.removeBuilder.pair(listName, undefined, (n) => { return `${n}[${index}]` })
    return this
  }

  addToSet(key: string, value: any): Update {
    const set = new Set([value].flat())
    this.addBuilder.pair(key, set, (n, v) => { return `${n} ${v}` })
    return this
  }

  deleteFromSet(key: string, value: any): Update {
    const set = new Set([value].flat())
    this.deleteBuilder.pair(key, set, (n, v) => { return `${n} ${v}` })
    return this
  }

  build(): UpdateCommandInput {
    const base = super.build()
    const update: UpdateCommandInput = { ...base, Key: this.key, UpdateExpression: this.buildUpdateExpression() }

    const names = { ...this.setBuilder.names, ...this.addBuilder.names, ...this.removeBuilder.names, ...this.deleteBuilder.names }
    if (Object.keys(names).length !== 0) update.ExpressionAttributeNames = { ...base.ExpressionAttributeNames, ...names }

    const values = { ...this.setBuilder.values, ...this.addBuilder.values, ...this.removeBuilder.values, ...this.deleteBuilder.values }
    if (Object.keys(values).length !== 0) update.ExpressionAttributeValues = { ...base.ExpressionAttributeValues, ...values }

    return update
  }
}