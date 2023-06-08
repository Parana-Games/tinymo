import { ExpressionBuilder } from "../src/expression"

describe('expression', () => {
  const expression = new ExpressionBuilder(' AND')

  it('add name', () => {
    expression.addName('atropos');
    expect(expression.names).toEqual({ '#atropos': 'atropos' });
    expect(expression.expression).toEqual('');
    expect(expression.values).toEqual({});
  })

  it('add nested name', () => {
    expression.addName('extra.nested.boi')
    expect(expression.names).toEqual({ '#atropos': 'atropos', '#extra': 'extra', '#nested': 'nested', '#boi': 'boi' })
    expect(expression.expression).toEqual('')
    expect(expression.values).toEqual({})
  })

  it('add value', () => {
    expression.addValue('valueName', false)
    expect(expression.expression).toEqual('')
    expect(expression.values).toEqual({ ':valueName': false })
  })

  it('add value with suffix', () => {
    expression.addValue('valueName', false, 'susfix')
    expect(expression.expression).toEqual('')
    expect(expression.values).toEqual({ ':valueName': false, ':valueNamesusfix': false })
  })

  it('append to expression', () => {
    expression.appendToExpression('pool')
    expect(expression.expression).toEqual('pool')
    
    expression.appendToExpression('stars')
    expect(expression.expression).toEqual('pool AND stars')

    expect(expression.names).toEqual({ '#atropos': 'atropos', '#extra': 'extra', '#nested': 'nested', '#boi': 'boi' })
    expect(expression.values).toEqual({ ':valueName': false, ':valueNamesusfix': false })
  })

  it('add pair', () => {
    expression.pair('woot', -42, (n, v) => `${n} i live here ${v}`)
    expect(expression.expression).toEqual('pool AND stars AND #woot i live here :woot')
  })
})