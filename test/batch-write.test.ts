import { TinymoClient } from '../src/client'

const client = TinymoClient.default()

describe('batch write', () => {
  it('should batch the write', () => {
    const batchWrite = client.batchWrite();

    batchWrite.put('table', { id: '1', name: 'test' });
    batchWrite.put('table2', { ID: '2', name: 'wawa' });
    batchWrite.put('table2', { id: '3', name: 'baba' });
    batchWrite.delete('table', { pk: '4', sK: 'woooo' });
    batchWrite.delete('table3', { Id: '5' });

    batchWrite.returnConsumedCapacity = 'TOTAL';
    batchWrite.returnItemCollectionMetrics = 'SIZE';

    const expected = {
      RequestItems: {
        'table': [
          {
            PutRequest: { Item: { id: '1', name: 'test' } }
          },
          {
            DeleteRequest: { Key: { pk: '4', sK: 'woooo' } }
          }
        ],
        'table2': [
          {
            PutRequest: { Item: { ID: '2', name: 'wawa' } }
          },
          {
            PutRequest: { Item: { id: '3', name: 'baba' } }
          }
        ],
        'table3': [
          {
            DeleteRequest: { Key: { Id: '5' } }
          }
        ],
      },
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE'
    }

    expect(batchWrite.build()).toEqual(expected)
  })
})