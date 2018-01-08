/**
 * @jest
 */

import install from '../../lib'

test('install jquery', () => {
  jest.setTimeout(10000)
  return expect(install('jquery')).resolves.toEqual({
    status: 'done'
  })
})
