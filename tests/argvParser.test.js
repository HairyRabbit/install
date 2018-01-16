/**
 * @jest
 */

import { P, D } from '../lib/flag'
import parseOpts from '../lib/argvParser'

test('parse libs', () => {
  expect(parseOpts(['foo', 'bar'])).toEqual([['foo', 'bar'], {
    addOptions: []
  }])
})

test('throw when no provide libs', () => {
  function runner() {
    parseOpts([])
  }
  expect(runner).toThrow()
})

test('add options', () => {
  expect(parseOpts(['foo', '--bar'])).toEqual([['foo'], {
    addOptions: ['--bar']
  }])
})

test('only add options', () => {
  function runner() {
    parseOpts(['--bar'])
  }
  expect(runner).toThrow()
})

test('flag', () => {
  expect(parseOpts(['foo', '--bar', '--dev'])).toEqual([['foo'], {
    addOptions: ['--bar'],
    flag: D
  }])
})
