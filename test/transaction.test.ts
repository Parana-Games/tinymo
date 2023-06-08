import { TinymoClient } from "../src"

const tinymo = TinymoClient.default()

describe('transaction', () => {
  it('build a transaction', () => {
    const transaction = tinymo.transaction()
    expect(transaction.isEmpty()).toBe(true)

    transaction.put('table1', { ID: '1' })
    transaction.delete('table3', { ID: '3' })

    const update = transaction.update('table2', { ID: '2' })
    update.set('adsjkl', 'wat').set('status', 'high')

    transaction.conditionCheck('table4', { ID: '2' }).conditionNotExists('nononono')

    expect(transaction.isEmpty()).toBe(false)

    const expected = {
      TransactItems: [
        {
          Put: {
            TableName: 'table1',
            Item: {
              ID: '1'
            }
          }
        },
        {
          Delete: {
            TableName: 'table3',
            Key: {
              ID: '3'
            }
          }
        },
        {
          Update: {
            TableName: 'table2',
            Key: {
              ID: '2'
            },
            UpdateExpression: 'SET #adsjkl = :adsjkl, #status = :status',
            ExpressionAttributeNames: {
              '#adsjkl': 'adsjkl',
              '#status': 'status'
            },
            ExpressionAttributeValues: {
              ':adsjkl': 'wat',
              ':status': 'high'
            }
          }
        },
        {
          ConditionCheck: {
            TableName: 'table4',
            Key: {
              ID: '2'
            },
            ConditionExpression: 'attribute_not_exists(#nononono)',
            ExpressionAttributeNames: {
              '#nononono': 'nononono'
            }
          }
        }
      ]
    }

    expect(transaction.build()).toEqual(expected)
  })
})