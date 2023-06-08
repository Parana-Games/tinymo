import { Delete } from "../src/delete"

describe('delete', () => {
  const d = new Delete('table', { PK: 'id', SK: 3 })

  it('build', () => {
    const built = d.build()
    expect(built).toEqual({ TableName: 'table', Key: { PK: 'id', SK: 3 } })
    expect(d.transactWriteItem()).toEqual({ Delete: built })
  })

  it('build with options', () => {
    d.returnConsumedCapacity = 'INDEXES'
    d.returnItemCollectionMetrics = 'SIZE'
    d.returnValues = 'ALL_OLD'

    expect(d.build()).toEqual({
      TableName: 'table',
      Key: { PK: 'id', SK: 3 },
      ReturnConsumedCapacity: 'INDEXES',
      ReturnItemCollectionMetrics: 'SIZE', 
      ReturnValues: 'ALL_OLD'
    })

    d.returnConsumedCapacity = undefined
    d.returnItemCollectionMetrics = undefined
    d.returnValues = undefined

    expect(d.build()).toEqual({
      TableName: 'table',
      Key: { PK: 'id', SK: 3 }
    })
  })
})