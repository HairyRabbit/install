import yarn from '../lib/yarn'

process.chdir(__dirname)

test('instance', () => {
  expect(yarn).toBeTruthy()
  expect(yarn.name).toBe('yarn')
  expect(yarn.installCmd).toBe('add')
  expect(yarn.options).toEqual({
    addOptions: ['--prefer-offline', '--json']
  })
})

test('install library basic', () => {
  return expect(yarn.install('jquery')).resolves.toBe()
}, 50000)

test('install library with options', () => {
  return expect(yarn.install('jquery')).resolves.toBe()
}, 50000)
