import { Scan } from '../src/scan'

describe('scan', () => {
  it('build', () => {
    const scan = new Scan('9zlxnc')
    scan.consistentRead = true
    scan.segment = 1
    scan.exclusiveStartKey = { PK: 'id', SK: 'user#purchase#000000000001' }

    scan.filter('PK', '=', 'id')
    scan.filter('plays', '<', 10_000_000)
    scan.filter('VIEWS', '>', 100_000_000)
    scan.filter('songs', '<=', 1_000_000)
    scan.filter('sleeps', '>=', 100_000)
    scan.filter('hope', '<>', 'gone')

    scan.filterBeginsWith('SK', 'user#purchas')
    scan.filterBetween('SK', 'user#purchase#2021-01-01', 'user#purchase#2021-01-02')
    scan.filterContains('cars', 'ford')
    scan.filterExists('aaaaaa')
    scan.filterIn('dontgo', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    scan.filterNotExists('bababa')

    scan.filterSize('xczlkjxc', '=', 0)
    scan.filterSize('acd', '<>', 1)
    scan.filterSize('zxc.zxc.9vvk', '<', 2)
    scan.filterSize('qwe.ZXC.cjcjcjc-jccjcj', '>', 3)
    scan.filterSize('Status', '<=', 4)
    scan.filterSize('dgtc', '>=', 5)

    expect(scan.build()).toEqual({
      TableName: '9zlxnc',
      ConsistentRead: true,
      Segment: 1,
      ExclusiveStartKey: { PK: 'id', SK: 'user#purchase#000000000001' },
      FilterExpression:
        '#PK = :PKEqualsConditionValue '
        + 'AND #plays < :playsLessThanConditionValue '
        + 'AND #VIEWS > :VIEWSGreaterThanConditionValue '
        + 'AND #songs <= :songsLessThanOrEqualsConditionValue '
        + 'AND #sleeps >= :sleepsGreaterThanOrEqualsConditionValue '
        + 'AND #hope <> :hopeNotEqualsConditionValue '
        + 'AND begins_with(#SK, :SKBeginsWithConditionValue) '
        + 'AND #SK BETWEEN :SKLower '
        + 'AND :SKUpper '
        + 'AND contains(#cars, :carsContainsConditionValue) '
        + 'AND attribute_exists(#aaaaaa) '
        + 'AND #dontgo IN (:dontgoInConditionValue0, :dontgoInConditionValue1, :dontgoInConditionValue2, :dontgoInConditionValue3, :dontgoInConditionValue4, :dontgoInConditionValue5, :dontgoInConditionValue6, :dontgoInConditionValue7, :dontgoInConditionValue8, :dontgoInConditionValue9) '
        + 'AND attribute_not_exists(#bababa) '
        + 'AND size(#xczlkjxc) = :xczlkjxcSizeEqualsConditionValue '
        + 'AND size(#acd) <> :acdSizeNotEqualsConditionValue '
        + 'AND size(#zxc.#zxc.#9vvk) < :zxczxc9vvkSizeLessThanConditionValue '
        + 'AND size(#qwe.#ZXC.#cjcjcjc-jccjcj) > :qweZXCcjcjcjc-jccjcjSizeGreaterThanConditionValue '
        + 'AND size(#Status) <= :StatusSizeLessThanOrEqualsConditionValue '
        + 'AND size(#dgtc) >= :dgtcSizeGreaterThanOrEqualsConditionValue',
      ExpressionAttributeNames: {
        "#9vvk": "9vvk",
        "#PK": "PK",
        "#SK": "SK",
        "#Status": "Status",
        "#VIEWS": "VIEWS",
        "#ZXC": "ZXC",
        "#aaaaaa": "aaaaaa",
        "#acd": "acd",
        "#bababa": "bababa",
        "#cars": "cars",
        "#cjcjcjc-jccjcj": "cjcjcjc-jccjcj",
        "#dgtc": "dgtc",
        "#dontgo": "dontgo",
        "#hope": "hope",
        "#plays": "plays",
        "#qwe": "qwe",
        "#sleeps": "sleeps",
        "#songs": "songs",
        "#xczlkjxc": "xczlkjxc",
        "#zxc": "zxc",
      },
      ExpressionAttributeValues: {
        ':PKEqualsConditionValue': 'id',
        ':playsLessThanConditionValue': 10_000_000,
        ':VIEWSGreaterThanConditionValue': 100_000_000,
        ':songsLessThanOrEqualsConditionValue': 1_000_000,
        ':sleepsGreaterThanOrEqualsConditionValue': 100_000,
        ':hopeNotEqualsConditionValue': 'gone',
        ':SKBeginsWithConditionValue': 'user#purchas',
        ':SKLower': 'user#purchase#2021-01-01',
        ':SKUpper': 'user#purchase#2021-01-02',
        ':carsContainsConditionValue': 'ford',
        ':dontgoInConditionValue0': 0,
        ':dontgoInConditionValue1': 1,
        ':dontgoInConditionValue2': 2,
        ':dontgoInConditionValue3': 3,
        ':dontgoInConditionValue4': 4,
        ':dontgoInConditionValue5': 5,
        ':dontgoInConditionValue6': 6,
        ':dontgoInConditionValue7': 7,
        ':dontgoInConditionValue8': 8,
        ':dontgoInConditionValue9': 9,
        ':xczlkjxcSizeEqualsConditionValue': 0,
        ':acdSizeNotEqualsConditionValue': 1,
        ':zxczxc9vvkSizeLessThanConditionValue': 2,
        ':qweZXCcjcjcjc-jccjcjSizeGreaterThanConditionValue': 3,
        ':StatusSizeLessThanOrEqualsConditionValue': 4,
        ':dgtcSizeGreaterThanOrEqualsConditionValue': 5,
      },
    })
  })
})