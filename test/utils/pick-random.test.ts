import { pickRandom } from '../../src/utils/pick-random'
import 'jest-extended'

it('returns a element from the array', () => {
  const inputArray = [1, 2, 3]

  expect(pickRandom(inputArray)).toBeOneOf(inputArray)
})

it('handles arrays with one item', () => {
  const inputArray = [1]

  expect(pickRandom(inputArray)).toEqual(1)
})
