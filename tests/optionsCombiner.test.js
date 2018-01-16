/**
 * @jest
 */

import { P } from '../lib/flag'
import merge from '../lib/optionsCombiner'

test('override flag2 to flag1', () => {
  expect(merge({ flag: 'foo' }, { flag: 'bar' }).flag).toBe('bar')
})

test('no set flag2, should be flag1', () => {
  expect(merge({ flag: 'foo' }, {}).flag).toBe('foo')
})

test('no set flag2 and flag1, should be P', () => {
  expect(merge({}, {}).flag).toBe(P)
})

test('merge addOptions', () => {
  expect(merge({ addOptions: ['--foo'] }, { addOptions: ['--bar'] }).addOptions)
    .toEqual(['--foo', '--bar'])
})

test('merge addOptions with undefiend', () => {
  expect(merge({ addOptions: ['--foo'] }).addOptions).toEqual(['--foo'])
})

test('merge spawnOptions', () => {
  expect(merge({ spawnOptions: { foo: 42 } }, { spawnOptions: { bar: 42 } }).spawnOptions)
    .toEqual({ foo: 42, bar: 42 })
})

test('merge spawnOptions with undefiend', () => {
  expect(merge().spawnOptions).toEqual({})
})
