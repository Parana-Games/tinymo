import { Put } from '../src/put'

describe('put', () => {
  const put = new Put('table', { id: 'id', name: 'name', thing: true, that: 0 })

  it('build', () => {
    const built = put.build()
    expect(built).toEqual({ TableName: 'table', Item: { id: 'id', name: 'name', thing: true, that: 0 } })
    expect(put.transactWriteItem()).toEqual({ Put: built })
  })

  it('build with options', () => {
    put.returnConsumedCapacity = 'NONE'
    put.returnItemCollectionMetrics = 'NONE'
    put.returnValues = 'UPDATED_OLD'

    expect(put.build()).toEqual({
      ReturnConsumedCapacity: 'NONE',
      ReturnItemCollectionMetrics: 'NONE',
      ReturnValues: 'UPDATED_OLD',
      TableName: 'table',
      Item: { id: 'id', name: 'name', thing: true, that: 0 }
    })

    put.returnConsumedCapacity = undefined
    put.returnItemCollectionMetrics = undefined
    put.returnValues = undefined

    expect(put.build()).toEqual({ TableName: 'table', Item: { id: 'id', name: 'name', thing: true, that: 0 } })
  })

  it('put with one condition', () => {
    put.condition('daze22.00', '=', true)

    expect(put.build()).toEqual({
      ConditionExpression: '#daze22.#00 = :daze2200EqualsConditionValue',
      ExpressionAttributeNames: { '#daze22': 'daze22', '#00': '00' },
      ExpressionAttributeValues: { ':daze2200EqualsConditionValue': true },
      TableName: 'table',
      Item: { id: 'id', name: 'name', thing: true, that: 0 }
    })
  })

  it('build put with 2 conditions', () => {
    put.condition('car', '<>', 9)

    expect(put.build()).toEqual({
      ConditionExpression: '#daze22.#00 = :daze2200EqualsConditionValue AND #car <> :carNotEqualsConditionValue',
      ExpressionAttributeNames: { '#daze22': 'daze22', '#00': '00', '#car': 'car' },
      ExpressionAttributeValues: { ':daze2200EqualsConditionValue': true, ':carNotEqualsConditionValue': 9 },
      TableName: 'table',
      Item: { id: 'id', name: 'name', thing: true, that: 0 }
    })
  })

  it('build put with all the conditions', () => {
    put.condition('71M3', '<=', 0)

    expect(put.build()).toEqual({
      ConditionExpression: '#daze22.#00 = :daze2200EqualsConditionValue AND #car <> :carNotEqualsConditionValue AND #71M3 <= :71M3LessThanOrEqualsConditionValue',
      ExpressionAttributeNames: { '#daze22': 'daze22', '#00': '00', '#car': 'car', '#71M3': '71M3' },
      ExpressionAttributeValues: { ':daze2200EqualsConditionValue': true, ':carNotEqualsConditionValue': 9, ':71M3LessThanOrEqualsConditionValue': 0 },
      TableName: 'table',
      Item: { id: 'id', name: 'name', thing: true, that: 0 }
    })

    put.conditionExists('emily_')

    expect(put.build()).toEqual({
      ConditionExpression: '#daze22.#00 = :daze2200EqualsConditionValue AND #car <> :carNotEqualsConditionValue AND #71M3 <= :71M3LessThanOrEqualsConditionValue AND attribute_exists(#emily_)',
      ExpressionAttributeNames: { '#daze22': 'daze22', '#00': '00', '#car': 'car', '#71M3': '71M3', '#emily_': 'emily_' },
      ExpressionAttributeValues: { ':daze2200EqualsConditionValue': true, ':carNotEqualsConditionValue': 9, ':71M3LessThanOrEqualsConditionValue': 0 },
      TableName: 'table',
      Item: { id: 'id', name: 'name', thing: true, that: 0 }
    })


    put.condition('yes.h', '>=', -1)
    put.condition('art', '<', 4)
    put.condition('race', '>', 2)

    put.conditionNotExists('PT')
    put.conditionType('hepa', 'Number')
    put.conditionBeginsWith('i', 'blocks')
    put.conditionContains('this', 'that')
    put.conditionBetween('soonth', 1, 2)

    put.conditionSize('71M3', '=', 0)
    put.conditionSize('dracul', '>', 2)
    put.conditionSize('GRAS', '<', 2)
    put.conditionSize('asus', '<=', 2)
    put.conditionSize('NADIR-E', '>=', 2)
    put.conditionSize('SeTu', '<>', 2)

    expect(put.build()).toEqual({
      TableName: 'table',
      Item: { id: 'id', name: 'name', thing: true, that: 0 },
      ConditionExpression: '#daze22.#00 = :daze2200EqualsConditionValue '
        + 'AND #car <> :carNotEqualsConditionValue '
        + 'AND #71M3 <= :71M3LessThanOrEqualsConditionValue '
        + 'AND attribute_exists(#emily_) AND #yes.#h >= :yeshGreaterThanOrEqualsConditionValue '
        + 'AND #art < :artLessThanConditionValue '
        + 'AND #race > :raceGreaterThanConditionValue '
        + 'AND attribute_not_exists(#PT) '
        + 'AND attribute_type(#hepa, N) '
        + 'AND begins_with(#i, :iBeginsWithConditionValue) '
        + 'AND contains(#this, :thisContainsConditionValue) '
        + 'AND #soonth BETWEEN :soonthLower AND :soonthUpper '
        + 'AND size(#71M3) = :71M3SizeEqualsConditionValue '
        + 'AND size(#dracul) > :draculSizeGreaterThanConditionValue '
        + 'AND size(#GRAS) < :GRASSizeLessThanConditionValue '
        + 'AND size(#asus) <= :asusSizeLessThanOrEqualsConditionValue '
        + 'AND size(#NADIR-E) >= :NADIR-ESizeGreaterThanOrEqualsConditionValue '
        + 'AND size(#SeTu) <> :SeTuSizeNotEqualsConditionValue',
      ExpressionAttributeNames: {
        '#daze22': 'daze22',
        '#00': '00',
        '#car': 'car',
        '#71M3': '71M3',
        '#emily_': 'emily_',
        '#yes': 'yes',
        '#h': 'h',
        '#art': 'art',
        '#race': 'race',
        '#PT': 'PT',
        '#hepa': 'hepa',
        '#i': 'i',
        '#this': 'this',
        '#soonth': 'soonth',
        '#dracul': 'dracul',
        '#GRAS': 'GRAS',
        '#asus': 'asus',
        '#NADIR-E': 'NADIR-E',
        '#SeTu': 'SeTu'
      },
      ExpressionAttributeValues: {
        ':daze2200EqualsConditionValue': true,
        ':carNotEqualsConditionValue': 9,
        ':71M3LessThanOrEqualsConditionValue': 0,
        ':yeshGreaterThanOrEqualsConditionValue': -1,
        ':artLessThanConditionValue': 4,
        ':raceGreaterThanConditionValue': 2,
        ':iBeginsWithConditionValue': 'blocks',
        ':thisContainsConditionValue': 'that',
        ':soonthUpper': 2,
        ':soonthLower': 1,
        ':71M3SizeEqualsConditionValue': 0,
        ':draculSizeGreaterThanConditionValue': 2,
        ':GRASSizeLessThanConditionValue': 2,
        ':asusSizeLessThanOrEqualsConditionValue': 2,
        ':NADIR-ESizeGreaterThanOrEqualsConditionValue': 2,
        ':SeTuSizeNotEqualsConditionValue': 2
      }
    })
  })
})