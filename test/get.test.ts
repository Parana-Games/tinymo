import { Get } from "../src/get"

describe('get', () => {
  it('get', () => {
    const get = new Get('table', { PK: 'big', SK: 'boi' })

    expect(get.build()).toEqual({
      TableName: 'table',
      Key: { PK: 'big', SK: 'boi' }
    })
  })

  it('get with projection expression', () => {
    const get = new Get('zxcnzmx-918hdas', { Key: 'kzxjlczx' })
    get.attributes('a', 'b', 'c')
    expect(get.build()).toEqual({
      TableName: 'zxcnzmx-918hdas',
      Key: { Key: 'kzxjlczx' },
      ProjectionExpression: '#a, #b, #c',
      ExpressionAttributeNames: { '#a': 'a', '#b': 'b', '#c': 'c' }
    })
  })

  it('get with options', () => {
    const get = new Get('table', { PK: 'big', SK: 'boi' })
    get.consistentRead = true
    get.returnConsumedCapacity = 'INDEXES'

    expect(get.build()).toEqual({
      TableName: 'table',
      Key: { PK: 'big', SK: 'boi' },
      ConsistentRead: true,
      ReturnConsumedCapacity: 'INDEXES'
    })

    get.consistentRead = undefined
    get.returnConsumedCapacity = undefined

    expect(get.build()).toEqual({
      TableName: 'table',
      Key: { PK: 'big', SK: 'boi' }
    })
  })
})