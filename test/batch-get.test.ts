import { TinymoClient } from '../src/client'

const client = TinymoClient.default()

describe('batch-get', () => {
  it('should batch the get', () => {
    const batchGet = client.batchGet()

    batchGet.get('table', [{ id: '1' }])
    batchGet.get('table2', [{ PK: 222 }])

    const expected = {
      RequestItems: {
        'table': { Keys: [{ id: '1' }], },
        'table2': { Keys: [{ 'PK': 222 }] }
      }
    }

    expect(batchGet.build()).toEqual(expected)
  })

  it('should batch the get 2', () => {
    const batchGet = client.batchGet()

    const a = batchGet.get('table', [{ id: '1' }])
    a.consistentRead = true
    a.returnConsumedCapacity = 'TOTAL'
    a.attributes('id', 'name')

    const sameTable = batchGet.get('table', [{ id: '2' }])
    sameTable.consistentRead = false
    batchGet.get('table2', [{ PK: '1' }])

    const expected = {
      RequestItems: {
        'table': {
          Keys: [{ id: '1' }, { id: '2' }],
          ConsistentRead: false,
          ProjectionExpression: '#id, #name',
          ExpressionAttributeNames: {
            '#id': 'id',
            '#name': 'name'
          }
        },
        'table2': { Keys: [{ 'PK': '1' }] }
      }
    }

    expect(batchGet.build()).toEqual(expected)
  })
})