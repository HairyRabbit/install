import yarn from '../lib/yarn'

test('yarn instance', () => {
  expect(yarn).toBeTruthy()
})

test('yarn install library basic', () => {
  return expect(yarn.install('jquery')).resolves.toBe()
})
