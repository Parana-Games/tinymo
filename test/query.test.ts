import { Query } from "../src/query"

describe('query', () => {
  it('key comparators', () => {
    const query = new Query('9zlxnc')

    query.key('PK', '=', 'id')
    query.key('SK', '<', -904)
    query.key('SK', '>', 102931)
    query.key('SK', '<=', 904)
    query.key('SK', '>=', 894)

    expect(query.build()).toEqual({
      TableName: '9zlxnc',
      KeyConditionExpression:
        '#PK = :PKEqualsConditionValue '
        + 'AND #SK < :SKLessThanConditionValue '
        + 'AND #SK > :SKGreaterThanConditionValue '
        + 'AND #SK <= :SKLessThanOrEqualsConditionValue '
        + 'AND #SK >= :SKGreaterThanOrEqualsConditionValue',
      ExpressionAttributeNames: { '#PK': 'PK', '#SK': 'SK' },
      ExpressionAttributeValues: {
        ':PKEqualsConditionValue': 'id',
        ':SKLessThanConditionValue': -904,
        ':SKGreaterThanConditionValue': 102931,
        ':SKLessThanOrEqualsConditionValue': 904,
        ':SKGreaterThanOrEqualsConditionValue': 894
      }
    })
  })

  it('key begins with & between', () => {
    const query = new Query('vgaUUdU5')
    query.keyBeginsWith('SK', 'ORDER')
    query.keyBetween('SK', 'ORDER#2021-01-01', 'ORDER#2021-01-02')
    expect(query.build()).toEqual({
      TableName: 'vgaUUdU5',
      KeyConditionExpression: 'begins_with(#SK, :SKBeginsWithConditionValue) AND #SK BETWEEN :SKLower AND :SKUpper',
      ExpressionAttributeNames: { '#SK': 'SK' },
      ExpressionAttributeValues: {
        ":SKBeginsWithConditionValue": "ORDER",
        ":SKLower": "ORDER#2021-01-01",
        ":SKUpper": "ORDER#2021-01-02"
      }
    })
  })

  it('filter expression comparators', () => {
    const query = new Query('NO_REGARD_FOR_THE_TABLE_NAME-87124yuhajkxNMB')

    query.filter('instrument', '=', 'mayones')
    query.filter('linger', '<>', 'long')
    query.filter('TypeOfPotato', '<', 'BANANA')
    query.filter('price', '>', 100000000)
    query.filter('bow', '<=', 'low')
    query.filter('dying', '>=', 'star')

    expect(query.build()).toEqual({
      TableName: 'NO_REGARD_FOR_THE_TABLE_NAME-87124yuhajkxNMB',
      FilterExpression:
        '#instrument = :instrumentEqualsConditionValue '
        + 'AND #linger <> :lingerNotEqualsConditionValue '
        + 'AND #TypeOfPotato < :TypeOfPotatoLessThanConditionValue '
        + 'AND #price > :priceGreaterThanConditionValue '
        + 'AND #bow <= :bowLessThanOrEqualsConditionValue '
        + 'AND #dying >= :dyingGreaterThanOrEqualsConditionValue',
      ExpressionAttributeNames: {
        '#instrument': 'instrument',
        '#linger': 'linger',
        '#TypeOfPotato': 'TypeOfPotato',
        '#price': 'price',
        '#bow': 'bow',
        '#dying': 'dying'
      },
      ExpressionAttributeValues: {
        ':instrumentEqualsConditionValue': 'mayones',
        ':lingerNotEqualsConditionValue': 'long',
        ':TypeOfPotatoLessThanConditionValue': 'BANANA',
        ':priceGreaterThanConditionValue': 100000000,
        ':bowLessThanOrEqualsConditionValue': 'low',
        ':dyingGreaterThanOrEqualsConditionValue': 'star'
      }
    })

  })

  it('other filters', () => {
    const query = new Query('momentdivine')

    query.key('PK', '=', 'id').key('SK', '<', -904)

    query.filterBeginsWith('name', 'zzzzzzz').filterBetween('age', 0, 100)
    query.filterContains('silhouette', 'friendofmine').filterExists('meeee')
    query.filterIn('aaaaahhh', ['a', 'b', 'c']).filterNotExists('aaaaahhhhhhhhh')
    query.filterType('aaaaaaaahhhhhhhhhhhh', 'Null')

    expect(query.build()).toEqual({
      TableName: 'momentdivine',
      FilterExpression:
        'begins_with(#name, :nameBeginsWithConditionValue) '
        + 'AND #age BETWEEN :ageLower '
        + 'AND :ageUpper '
        + 'AND contains(#silhouette, :silhouetteContainsConditionValue) '
        + 'AND attribute_exists(#meeee) '
        + 'AND #aaaaahhh IN (:aaaaahhhInConditionValue0, :aaaaahhhInConditionValue1, :aaaaahhhInConditionValue2) '
        + 'AND attribute_not_exists(#aaaaahhhhhhhhh) '
        + 'AND attribute_type(#aaaaaaaahhhhhhhhhhhh, NULL)',
      KeyConditionExpression: '#PK = :PKEqualsConditionValue AND #SK < :SKLessThanConditionValue',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
        '#name': 'name',
        '#age': 'age',
        '#silhouette': 'silhouette',
        '#meeee': 'meeee',
        '#aaaaahhh': 'aaaaahhh',
        '#aaaaahhhhhhhhh': 'aaaaahhhhhhhhh',
        '#aaaaaaaahhhhhhhhhhhh': 'aaaaaaaahhhhhhhhhhhh'
      },
      ExpressionAttributeValues: {
        ':nameBeginsWithConditionValue': 'zzzzzzz',
        ':ageLower': 0,
        ':ageUpper': 100,
        ':silhouetteContainsConditionValue': 'friendofmine',
        ':aaaaahhhInConditionValue0': 'a',
        ':aaaaahhhInConditionValue1': 'b',
        ':aaaaahhhInConditionValue2': 'c',
        ':PKEqualsConditionValue': 'id',
        ':SKLessThanConditionValue': -904
      }
    })
  })

  it('size filters', () => {
    const query = new Query('planteryduality')
    query.filterSize('paaa', '=', 0)
    query.filterSize('mzzz', '<>', 1)
    query.filterSize('pageUP', '<', 2)
    query.filterSize('ABCDEFG', '>', 3)
    query.filterSize('pageDown', '<=', 4)
    query.filterSize('WOWWW', '>=', 5)

    expect(query.build()).toEqual({
      TableName: 'planteryduality',
      FilterExpression:
        'size(#paaa) = :paaaSizeEqualsConditionValue '
        + 'AND size(#mzzz) <> :mzzzSizeNotEqualsConditionValue '
        + 'AND size(#pageUP) < :pageUPSizeLessThanConditionValue '
        + 'AND size(#ABCDEFG) > :ABCDEFGSizeGreaterThanConditionValue '
        + 'AND size(#pageDown) <= :pageDownSizeLessThanOrEqualsConditionValue '
        + 'AND size(#WOWWW) >= :WOWWWSizeGreaterThanOrEqualsConditionValue',
      ExpressionAttributeNames: {
        '#paaa': 'paaa',
        '#mzzz': 'mzzz',
        '#pageUP': 'pageUP',
        '#ABCDEFG': 'ABCDEFG',
        '#pageDown': 'pageDown',
        '#WOWWW': 'WOWWW'
      },
      ExpressionAttributeValues: {
        ':paaaSizeEqualsConditionValue': 0,
        ':mzzzSizeNotEqualsConditionValue': 1,
        ':pageUPSizeLessThanConditionValue': 2,
        ':ABCDEFGSizeGreaterThanConditionValue': 3,
        ':pageDownSizeLessThanOrEqualsConditionValue': 4,
        ':WOWWWSizeGreaterThanOrEqualsConditionValue': 5
      }
    })
  })

  it('query with options', () => {
    const query = new Query('HI')

    query.consistentRead = true
    query.exclusiveStartKey = { PK: 'id', SK: 'ORDER#2021-01-01' }
    query.limit = 10
    query.select = 'ALL_ATTRIBUTES'
    query.scanIndexForward = false
    query.key('ID', '=', '9zx8uczh').key('SK', '<', 'SONG#00001')

    expect(query.build()).toEqual({
      TableName: 'HI',
      ConsistentRead: true,
      Select: 'ALL_ATTRIBUTES',
      Limit: 10,
      ScanIndexForward: false,
      KeyConditionExpression: '#ID = :IDEqualsConditionValue AND #SK < :SKLessThanConditionValue',
      ExclusiveStartKey: { PK: 'id', SK: 'ORDER#2021-01-01' },
      ExpressionAttributeNames: { '#ID': 'ID', '#SK': 'SK' },
      ExpressionAttributeValues: { ':IDEqualsConditionValue': '9zx8uczh', ':SKLessThanConditionValue': 'SONG#00001' }
    })

    query.consistentRead = false
    query.exclusiveStartKey = undefined
    query.limit = undefined
    query.select = undefined
    query.scanIndexForward = undefined

    expect(query.build()).toEqual({
      TableName: 'HI',
      ConsistentRead: false,
      KeyConditionExpression: '#ID = :IDEqualsConditionValue AND #SK < :SKLessThanConditionValue',
      ExpressionAttributeNames: { '#ID': 'ID', '#SK': 'SK' },
      ExpressionAttributeValues: { ':IDEqualsConditionValue': '9zx8uczh', ':SKLessThanConditionValue': 'SONG#00001' }
    })
  })
})