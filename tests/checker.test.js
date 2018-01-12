import checker from '../lib/checker'

const check = checker(__dirname)

test('should be true, when installed', () => {
  expect(check('jquery')).toBe(true)
})

test('should be false, when not found', () => {
  expect(check('react')).toBe(false)
})

test('should be false, when package.json not exist', () => {
  const rd = Math.random().toString(36).substr(2, 8)
  expect(checker('/tmp/' + rd)).toBe(null)
})
