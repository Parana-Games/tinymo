import { ConditionExpression } from '../src/condition'

describe('condition', () => {
  it('suffixForComparator', () => {
    expect(ConditionExpression.suffixForComparator('=')).toEqual('EqualsConditionValue')
    expect(ConditionExpression.suffixForComparator('<>')).toEqual('NotEqualsConditionValue')
    expect(ConditionExpression.suffixForComparator('<')).toEqual('LessThanConditionValue')
    expect(ConditionExpression.suffixForComparator('<=')).toEqual('LessThanOrEqualsConditionValue')
    expect(ConditionExpression.suffixForComparator('>')).toEqual('GreaterThanConditionValue')
    expect(ConditionExpression.suffixForComparator('>=')).toEqual('GreaterThanOrEqualsConditionValue')
  })

  it('dynamoTypeString', () => {
    expect(ConditionExpression.dynamoTypeString('String')).toEqual('S')
    expect(ConditionExpression.dynamoTypeString('String Set')).toEqual('SS')
    expect(ConditionExpression.dynamoTypeString('Number')).toEqual('N')
    expect(ConditionExpression.dynamoTypeString('Number Set')).toEqual('NS')
    expect(ConditionExpression.dynamoTypeString('Binary')).toEqual('B')
    expect(ConditionExpression.dynamoTypeString('Binary Set')).toEqual('BS')
    expect(ConditionExpression.dynamoTypeString('Boolean')).toEqual('BOOL')
    expect(ConditionExpression.dynamoTypeString('Null')).toEqual('NULL')
    expect(ConditionExpression.dynamoTypeString('List')).toEqual('L')
    expect(ConditionExpression.dynamoTypeString('Map')).toEqual('M')
  })

  const multipleConditions = new ConditionExpression()

  it('exists', () => {
    multipleConditions.exists('me')
    expect(multipleConditions.expression).toEqual('attribute_exists(#me)')
    expect(multipleConditions.names).toEqual({ '#me': 'me' })
    expect(multipleConditions.values).toEqual({})
  })

  it('not exists', () => {
    multipleConditions.notExists('youhaha')
    expect(multipleConditions.expression).toEqual('attribute_exists(#me) AND attribute_not_exists(#youhaha)')
    expect(multipleConditions.names).toEqual({ '#me': 'me', '#youhaha': 'youhaha' })
    expect(multipleConditions.values).toEqual({})
  })

  it('type', () => {
    multipleConditions.type('notmytype', 'Binary')
    expect(multipleConditions.expression).toEqual('attribute_exists(#me) AND attribute_not_exists(#youhaha) AND attribute_type(#notmytype, B)')
    expect(multipleConditions.names).toEqual({ '#me': 'me', '#youhaha': 'youhaha', '#notmytype': 'notmytype' })
    expect(multipleConditions.values).toEqual({})
  })

  it('begins with', () => {
    multipleConditions.beginsWith('name', 'dan')
    expect(multipleConditions.expression).toEqual('attribute_exists(#me) AND attribute_not_exists(#youhaha) AND attribute_type(#notmytype, B) AND begins_with(#name, :nameBeginsWithConditionValue)')
    expect(multipleConditions.names).toEqual({ '#me': 'me', '#youhaha': 'youhaha', '#notmytype': 'notmytype', '#name': 'name' })
    expect(multipleConditions.values).toEqual({ ':nameBeginsWithConditionValue': 'dan' })
  })

  it('contains', () => {
    multipleConditions.contains('life', 'meaning')
    expect(multipleConditions.expression).toEqual(
      'attribute_exists(#me) '
      + 'AND attribute_not_exists(#youhaha) '
      + 'AND attribute_type(#notmytype, B) '
      + 'AND begins_with(#name, :nameBeginsWithConditionValue) '
      + 'AND contains(#life, :lifeContainsConditionValue)')

    expect(multipleConditions.names).toEqual({ '#me': 'me', '#youhaha': 'youhaha', '#notmytype': 'notmytype', '#name': 'name', '#life': 'life' })
    expect(multipleConditions.values).toEqual({ ':nameBeginsWithConditionValue': 'dan', ':lifeContainsConditionValue': 'meaning' })
  })

  const comparatorConditionExpression = new ConditionExpression()

  it('comparators', () => {
    comparatorConditionExpression.compare('somenum', '=', 30)
    expect(comparatorConditionExpression.expression).toEqual('#somenum = :somenumEqualsConditionValue')
    expect(comparatorConditionExpression.names).toEqual({ '#somenum': 'somenum' })
    expect(comparatorConditionExpression.values).toEqual({ ':somenumEqualsConditionValue': 30 })

    comparatorConditionExpression.compare('somenum', '<>', 30)
    expect(comparatorConditionExpression.expression).toEqual(
      '#somenum = :somenumEqualsConditionValue '
      + 'AND #somenum <> :somenumNotEqualsConditionValue')
    expect(comparatorConditionExpression.names).toEqual({ '#somenum': 'somenum' })
    expect(comparatorConditionExpression.values).toEqual({ ':somenumEqualsConditionValue': 30, ':somenumNotEqualsConditionValue': 30 })

    comparatorConditionExpression.compare('pudwud', '<', 30)
    expect(comparatorConditionExpression.expression).toEqual(
      '#somenum = :somenumEqualsConditionValue '
      + 'AND #somenum <> :somenumNotEqualsConditionValue '
      + 'AND #pudwud < :pudwudLessThanConditionValue')
    expect(comparatorConditionExpression.names).toEqual({ '#somenum': 'somenum', '#pudwud': 'pudwud' })
    expect(comparatorConditionExpression.values).toEqual({ ':somenumEqualsConditionValue': 30, ':somenumNotEqualsConditionValue': 30, ':pudwudLessThanConditionValue': 30 })

    comparatorConditionExpression.compare('redalert', '<=', 30)
    expect(comparatorConditionExpression.expression).toEqual(
      '#somenum = :somenumEqualsConditionValue '
      + 'AND #somenum <> :somenumNotEqualsConditionValue '
      + 'AND #pudwud < :pudwudLessThanConditionValue '
      + 'AND #redalert <= :redalertLessThanOrEqualsConditionValue')
    expect(comparatorConditionExpression.names).toEqual({ '#somenum': 'somenum', '#pudwud': 'pudwud', '#redalert': 'redalert' })
    expect(comparatorConditionExpression.values).toEqual({
      ':somenumEqualsConditionValue': 30,
      ':somenumNotEqualsConditionValue': 30,
      ':pudwudLessThanConditionValue': 30,
      ':redalertLessThanOrEqualsConditionValue': 30
    })

    comparatorConditionExpression.compare('somenum', '>', 30)
    expect(comparatorConditionExpression.expression).toEqual(
      '#somenum = :somenumEqualsConditionValue '
      + 'AND #somenum <> :somenumNotEqualsConditionValue '
      + 'AND #pudwud < :pudwudLessThanConditionValue '
      + 'AND #redalert <= :redalertLessThanOrEqualsConditionValue '
      + 'AND #somenum > :somenumGreaterThanConditionValue')

    comparatorConditionExpression.compare('somenum', '>=', 30)
    expect(comparatorConditionExpression.expression).toEqual(
      '#somenum = :somenumEqualsConditionValue '
      + 'AND #somenum <> :somenumNotEqualsConditionValue '
      + 'AND #pudwud < :pudwudLessThanConditionValue '
      + 'AND #redalert <= :redalertLessThanOrEqualsConditionValue '
      + 'AND #somenum > :somenumGreaterThanConditionValue '
      + 'AND #somenum >= :somenumGreaterThanOrEqualsConditionValue')
  })

  it('size comparators', () => {
    const sizeConditionExpression = new ConditionExpression()

    sizeConditionExpression.size('potato', '=', 1)
    expect(sizeConditionExpression.expression).toEqual('size(#potato) = :potatoSizeEqualsConditionValue')
    expect(sizeConditionExpression.names).toEqual({ '#potato': 'potato' })
    expect(sizeConditionExpression.values).toEqual({ ':potatoSizeEqualsConditionValue': 1 })

    sizeConditionExpression.size('tomato', '<>', 20000)
    expect(sizeConditionExpression.expression).toEqual(
      'size(#potato) = :potatoSizeEqualsConditionValue '
      + 'AND size(#tomato) <> :tomatoSizeNotEqualsConditionValue')
    expect(sizeConditionExpression.names).toEqual({ '#potato': 'potato', '#tomato': 'tomato' })
    expect(sizeConditionExpression.values).toEqual({ ':potatoSizeEqualsConditionValue': 1, ':tomatoSizeNotEqualsConditionValue': 20000 })

    sizeConditionExpression.size('help', '<', -4444)
    expect(sizeConditionExpression.expression).toEqual(
      'size(#potato) = :potatoSizeEqualsConditionValue '
      + 'AND size(#tomato) <> :tomatoSizeNotEqualsConditionValue '
      + 'AND size(#help) < :helpSizeLessThanConditionValue')
    expect(sizeConditionExpression.names).toEqual({ '#potato': 'potato', '#tomato': 'tomato', '#help': 'help' })
    expect(sizeConditionExpression.values).toEqual({ ':potatoSizeEqualsConditionValue': 1, ':tomatoSizeNotEqualsConditionValue': 20000, ':helpSizeLessThanConditionValue': -4444 })

    sizeConditionExpression.size('send', '<=', 0)
    expect(sizeConditionExpression.expression).toEqual(
      'size(#potato) = :potatoSizeEqualsConditionValue '
      + 'AND size(#tomato) <> :tomatoSizeNotEqualsConditionValue '
      + 'AND size(#help) < :helpSizeLessThanConditionValue '
      + 'AND size(#send) <= :sendSizeLessThanOrEqualsConditionValue')
    expect(sizeConditionExpression.names).toEqual({ '#potato': 'potato', '#tomato': 'tomato', '#help': 'help', '#send': 'send' })
    expect(sizeConditionExpression.values).toEqual({
      ':potatoSizeEqualsConditionValue': 1,
      ':tomatoSizeNotEqualsConditionValue': 20000,
      ':helpSizeLessThanConditionValue': -4444,
      ':sendSizeLessThanOrEqualsConditionValue': 0
    })

    sizeConditionExpression.size('hep', '>', 30)
    expect(sizeConditionExpression.expression).toEqual(
      'size(#potato) = :potatoSizeEqualsConditionValue '
      + 'AND size(#tomato) <> :tomatoSizeNotEqualsConditionValue '
      + 'AND size(#help) < :helpSizeLessThanConditionValue '
      + 'AND size(#send) <= :sendSizeLessThanOrEqualsConditionValue '
      + 'AND size(#hep) > :hepSizeGreaterThanConditionValue')
    expect(sizeConditionExpression.names).toEqual({ '#potato': 'potato', '#tomato': 'tomato', '#help': 'help', '#send': 'send', '#hep': 'hep' })
    expect(sizeConditionExpression.values).toEqual({
      ':potatoSizeEqualsConditionValue': 1,
      ':tomatoSizeNotEqualsConditionValue': 20000,
      ':helpSizeLessThanConditionValue': -4444,
      ':sendSizeLessThanOrEqualsConditionValue': 0,
      ':hepSizeGreaterThanConditionValue': 30
    })

    sizeConditionExpression.size('singularity', '>=', 2030)
    expect(sizeConditionExpression.expression).toEqual(
      'size(#potato) = :potatoSizeEqualsConditionValue '
      + 'AND size(#tomato) <> :tomatoSizeNotEqualsConditionValue '
      + 'AND size(#help) < :helpSizeLessThanConditionValue '
      + 'AND size(#send) <= :sendSizeLessThanOrEqualsConditionValue '
      + 'AND size(#hep) > :hepSizeGreaterThanConditionValue '
      + 'AND size(#singularity) >= :singularitySizeGreaterThanOrEqualsConditionValue')
    expect(sizeConditionExpression.names).toEqual({ '#potato': 'potato', '#tomato': 'tomato', '#help': 'help', '#send': 'send', '#hep': 'hep', '#singularity': 'singularity' })
    expect(sizeConditionExpression.values).toEqual({
      ':potatoSizeEqualsConditionValue': 1,
      ':tomatoSizeNotEqualsConditionValue': 20000,
      ':helpSizeLessThanConditionValue': -4444,
      ':sendSizeLessThanOrEqualsConditionValue': 0,
      ':hepSizeGreaterThanConditionValue': 30,
      ':singularitySizeGreaterThanOrEqualsConditionValue': 2030
    })
  })

  it('attribute between', () => {
    const betweenConditionExpression = new ConditionExpression()
    betweenConditionExpression.between('parks', 1, 10)
    expect(betweenConditionExpression.expression).toEqual('#parks BETWEEN :parksLower AND :parksUpper')
    expect(betweenConditionExpression.names).toEqual({ '#parks': 'parks' })
    expect(betweenConditionExpression.values).toEqual({ ':parksLower': 1, ':parksUpper': 10 })
  })

  it('attribute in', () => {
    const inConditionExpression = new ConditionExpression()
    inConditionExpression.in('song.name', ['parks', 'on', 'fire'])
    expect(inConditionExpression.expression).toEqual('#song.#name IN (:songnameInConditionValue0, :songnameInConditionValue1, :songnameInConditionValue2)')
    expect(inConditionExpression.names).toEqual({ '#song': 'song', '#name': 'name' })
    expect(inConditionExpression.values).toEqual({ ':songnameInConditionValue0': 'parks', ':songnameInConditionValue1': 'on', ':songnameInConditionValue2': 'fire' })
  })

  it('or conditional evaluation', () => {
    const conditionalConditionExpression = new ConditionExpression()
    conditionalConditionExpression.exists('awake')
    conditionalConditionExpression.or()
    conditionalConditionExpression.notExists('apogee')

    expect(conditionalConditionExpression.expression).toEqual('attribute_exists(#awake) OR attribute_not_exists(#apogee)')
    expect(conditionalConditionExpression.names).toEqual({ '#awake': 'awake', '#apogee': 'apogee' })
    expect(conditionalConditionExpression.values).toEqual({})
  })

  it('not conditional evaluation', () => {
    const conditionalConditionExpression = new ConditionExpression()
    conditionalConditionExpression.not()
    conditionalConditionExpression.exists('awake')
    conditionalConditionExpression.or()
    conditionalConditionExpression.not().between('apogee', 1, 10)

    expect(conditionalConditionExpression.expression).toEqual('NOT attribute_exists(#awake) OR NOT #apogee BETWEEN :apogeeLower AND :apogeeUpper')
    expect(conditionalConditionExpression.names).toEqual({ '#awake': 'awake', '#apogee': 'apogee' })
    expect(conditionalConditionExpression.values).toEqual({ ':apogeeLower': 1, ':apogeeUpper': 10 })
  })
})