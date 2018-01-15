/**
 * @jest
 */

import { P, D } from '../lib/flag'
import { babel } from '../lib/library'
import parseopt from '../lib/parseopt'

test('parse libs', () => {
  expect(parseopt(['foo', 'bar'])).toEqual([['foo', 'bar'], {
    addOptions: []
  }])
})

test('throw when no provide libs', () => {
  function runner() {
    parseopt([])
  }
  expect(runner).toThrow()
})

test('add options', () => {
  expect(parseopt(['foo', '--bar'])).toEqual([['foo'], {
    addOptions: ['--bar']
  }])
})

test('only add options', () => {
  function runner() {
    parseopt(['--bar'])
  }
  expect(runner).toThrow()
})

test('flag', () => {
  expect(parseopt(['foo', '--bar', '--dev'])).toEqual([['foo'], {
    addOptions: ['--bar'],
    flag: D
  }])
})

test('librarys', () => {
  expect(parseopt(['foo', 'babel.'])).toEqual([['foo', babel], {
    addOptions: []
  }])
})
