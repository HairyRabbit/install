import buildin from '../lib/symbols'

test('should be a symbol', () => {
  expect(typeof buildin.babel).toBe('symbol')
})
