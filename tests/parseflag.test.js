import { D, P, O, _ } from '../lib/flag'
import parseflag from '../lib/parseflag'

test('should be default', () => {
  expect(parseflag()).toBe(P)
})

test('shoud be dev', () => {
  expect(parseflag('--dev')).toBe(D)
  expect(parseflag('--development')).toBe(D)
  expect(parseflag('-D')).toBe(D)
})

test('shoud be prod', () => {
  expect(parseflag('--prod')).toBe(P)
  expect(parseflag('--production')).toBe(P)
  expect(parseflag('-P')).toBe(P)
})

test('shoud be optional', () => {
  expect(parseflag('--optional')).toBe(O)
  expect(parseflag('-O')).toBe(O)
})
