import { Update } from "../src/update"

describe('update', () => {
  const update = new Update('table1850', { PK: 'big', SK: 'boi' })

  it('build with just one set', () => {
    expect(update.isEmpty()).toBe(true)
    update.set('a', 1)
    expect(update.isEmpty()).toBe(false)
    const built = update.build()

    expect(built).toEqual({
      TableName: 'table1850',
      Key: { PK: 'big', SK: 'boi' },
      UpdateExpression: 'SET #a = :a',
      ExpressionAttributeNames: { '#a': 'a' },
      ExpressionAttributeValues: { ':a': 1 }
    })

    expect(update.transactWriteItem()).toEqual({ Update: built })
  })

  it('build with options', () => {
    update.returnValues = 'ALL_NEW'
    update.returnItemCollectionMetrics = 'NONE'
    update.returnConsumedCapacity = 'INDEXES'

    expect(update.build()).toEqual({
      TableName: 'table1850',
      Key: { PK: 'big', SK: 'boi' },
      UpdateExpression: 'SET #a = :a',
      ExpressionAttributeNames: { '#a': 'a' },
      ExpressionAttributeValues: { ':a': 1 },
      ReturnValues: 'ALL_NEW',
      ReturnItemCollectionMetrics: 'NONE',
      ReturnConsumedCapacity: 'INDEXES'
    })

    update.returnValues = undefined
    update.returnItemCollectionMetrics = undefined
    update.returnConsumedCapacity = undefined

    expect(update.build()).toEqual({
      TableName: 'table1850',
      Key: { PK: 'big', SK: 'boi' },
      UpdateExpression: 'SET #a = :a',
      ExpressionAttributeNames: { '#a': 'a' },
      ExpressionAttributeValues: { ':a': 1 }
    })
  })

  it('build with set & 3 removes', () => {
    update.remove('r1', 'r2', 'r3')

    expect(update.build()).toEqual({
      TableName: 'table1850',
      Key: { PK: 'big', SK: 'boi' },
      UpdateExpression: 'SET #a = :a REMOVE #r1, #r2, #r3',
      ExpressionAttributeNames: { '#a': 'a', '#r1': 'r1', '#r2': 'r2', '#r3': 'r3' },
      ExpressionAttributeValues: { ':a': 1 }
    })
  })

  it('build with a bunch of stuff!', () => {
    update.add('b', 'str')
    update.subtract('c', 1)
    update.addToList('list', [1, '2', false])
    update.setListItem('thatList', 1, 'bla')
    update.removeIndexFromList('otherList', 2)
    update.addToSet('someSet', [1, 2, 3])
    update.deleteFromSet('anotherSet', 2)

    update.condition('daze22.00', '=', true)
    update.condition('car', '<>', 9)
    update.condition('car', '<>', 10)
    update.condition('71M3', '<=', 0)
    update.condition('yes.h', '>=', -1)
    update.condition('art', '<', 4)
    update.condition('art', '<', 8)
    update.condition('race', '>', 2)

    update.conditionExists('emily_')
    update.conditionNotExists('PT')
    update.conditionType('hepa', 'Number')
    update.conditionBeginsWith('i', 'blocks')
    update.conditionContains('this', 'that')
    update.conditionBetween('soonth', 1, 2)

    update.conditionSize('71M3', '=', 0)
    update.conditionSize('dracul', '>', 2)
    update.conditionSize('GRAS', '<', 2)
    update.conditionSize('asus', '<=', 2)
    update.conditionSize('NADIR-E', '>=', 2)
    update.conditionSize('SeTu', '<>', 2)

    const expected = {
      TableName: 'table1850',
      Key: { PK: 'big', SK: 'boi' },
      UpdateExpression:
        'SET #a = :a, #c = #c - :c, #list = list_append(if_not_exists(#list, :newList), :list), #thatList[1] = :thatList '
        + 'ADD #b :b, #someSet :someSet '
        + 'REMOVE #r1, #r2, #r3, #otherList[2] '
        + 'DELETE #anotherSet :anotherSet',
      ExpressionAttributeNames: {
        "#a": "a",
        "#anotherSet": "anotherSet",
        "#b": "b",
        "#r1": "r1",
        "#c": "c",
        "#list": "list",
        "#otherList": "otherList",
        "#r2": "r2",
        "#r3": "r3",
        "#someSet": "someSet",
        "#thatList": "thatList",
        '#daze22': 'daze22',
        '#00': '00',
        '#car': 'car',
        '#71M3': '71M3',
        '#yes': 'yes',
        '#h': 'h',
        '#art': 'art',
        '#race': 'race',
        '#emily_': 'emily_',
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
        ':a': 1,
        ':b': 'str',
        ":anotherSet": new Set([2]),
        ":someSet": new Set([1, 2, 3]),
        ":c": 1,
        ":list": [1, "2", false],
        ":newList": [],
        ":thatList": "bla",
        ':daze2200EqualsConditionValue': true,
        ':carNotEqualsConditionValue': 9,
        ':carNotEqualsConditionValue2': 10,
        ':71M3LessThanOrEqualsConditionValue': 0,
        ':yeshGreaterThanOrEqualsConditionValue': -1,
        ':artLessThanConditionValue': 4,
        ':artLessThanConditionValue2': 8,
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
      },
      ConditionExpression:
        '#daze22.#00 = :daze2200EqualsConditionValue'
        + ' AND #car <> :carNotEqualsConditionValue'
        + ' AND #car <> :carNotEqualsConditionValue2'
        + ' AND #71M3 <= :71M3LessThanOrEqualsConditionValue'
        + ' AND #yes.#h >= :yeshGreaterThanOrEqualsConditionValue'
        + ' AND #art < :artLessThanConditionValue'
        + ' AND #art < :artLessThanConditionValue2'
        + ' AND #race > :raceGreaterThanConditionValue'
        + ' AND attribute_exists(#emily_)'
        + ' AND attribute_not_exists(#PT)'
        + ' AND attribute_type(#hepa, N)'
        + ' AND begins_with(#i, :iBeginsWithConditionValue)'
        + ' AND contains(#this, :thisContainsConditionValue)'
        + ' AND #soonth BETWEEN :soonthLower AND :soonthUpper'
        + ' AND size(#71M3) = :71M3SizeEqualsConditionValue'
        + ' AND size(#dracul) > :draculSizeGreaterThanConditionValue'
        + ' AND size(#GRAS) < :GRASSizeLessThanConditionValue'
        + ' AND size(#asus) <= :asusSizeLessThanOrEqualsConditionValue'
        + ' AND size(#NADIR-E) >= :NADIR-ESizeGreaterThanOrEqualsConditionValue'
        + ' AND size(#SeTu) <> :SeTuSizeNotEqualsConditionValue'
    }

    expect(update.build()).toStrictEqual(expected)
    expect(update.transactWriteItem()).toStrictEqual({ Update: expected })
  })

  it('should include used & omit unused properties', () => {
    const update1 = new Update('90zcjx', { PK: 'catch', SK: 33 }).set('autonomy', false).condition('autonomy', '=', true)
    update1.returnItemCollectionMetrics = 'SIZE'
    update1.returnConsumedCapacity = 'TOTAL'

    const expected1 = {
      ConditionExpression: '#autonomy = :autonomyEqualsConditionValue',
      ExpressionAttributeNames: { '#autonomy': 'autonomy' },
      ExpressionAttributeValues: { ':autonomyEqualsConditionValue': true, ':autonomy': false },
      TableName: '90zcjx',
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      Key: { PK: 'catch', SK: 33 },
      UpdateExpression: 'SET #autonomy = :autonomy'
    }

    const update2 = new Update('90zcjx', { PK: 'catch', SK: 33 })
    update2.returnItemCollectionMetrics = 'NONE'

    expect(update2.isEmpty()).toBe(true)
    update2.set('autonomy', false).condition('autonomy', '=', true)
    expect(update2.isEmpty()).toBe(false)

    const expected2 = {
      ConditionExpression: '#autonomy = :autonomyEqualsConditionValue',
      ExpressionAttributeNames: { '#autonomy': 'autonomy' },
      ExpressionAttributeValues: { ':autonomyEqualsConditionValue': true, ':autonomy': false },
      TableName: '90zcjx',
      Key: { PK: 'catch', SK: 33 },
      UpdateExpression: 'SET #autonomy = :autonomy',
      ReturnItemCollectionMetrics: 'NONE'
    }

    expect(update1.build()).toStrictEqual(expected1)
    expect(update2.build()).toStrictEqual(expected2)
  })

  it('build with condition duplicates', () => {
    const updateWithDuplicates = new Update('table1850', { PK: 'duplicates' })
    updateWithDuplicates.condition('a', '=', 1)
    updateWithDuplicates.condition('a', '=', 2)
    updateWithDuplicates.condition('a', '=', 3)

    expect(updateWithDuplicates.build()).toStrictEqual({
      TableName: 'table1850',
      Key: { PK: 'duplicates' },
      UpdateExpression: '',
      ExpressionAttributeNames: { '#a': 'a' },
      ExpressionAttributeValues: {
        ':aEqualsConditionValue': 1,
        ':aEqualsConditionValue2': 2,
        ':aEqualsConditionValue3': 3,
      },
      ConditionExpression: "#a = :aEqualsConditionValue AND #a = :aEqualsConditionValue2 AND #a = :aEqualsConditionValue3"
    })
  })
})