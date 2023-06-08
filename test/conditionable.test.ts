import { Conditionable } from "../src/conditionable"

describe('conditionable', () => {
  it('isntEmpty', () => {
    expect(Conditionable.isntEmpty({ a: 1, b: 2 })).toBeTruthy()
    expect(Conditionable.isntEmpty({})).toBeFalsy()
  })
})