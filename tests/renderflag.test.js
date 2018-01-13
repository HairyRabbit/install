import { D, P, O } from '../lib/flag'
import renderflag from '../lib/renderflag'

test('render default', () => {
  expect(renderflag(P)).toBe('')
  expect(renderflag(42)).toBe('')
})

test('render dev', () => {
  expect(renderflag(D)).toBe('-D')
})

test('render optional', () => {
  expect(renderflag(O)).toBe('-O')
})
