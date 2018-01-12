import fs from 'fs'
import path from 'path'
import buildin from '../lib/symbols'
import parser from '../lib/parser'

test('should be symbol, when matched', () => {
  expect(parser('babel-core')).toBe(buildin.babel)
})

test('should be string, when not matched', () => {
  expect(parser('foo')).toBe('foo')
})

test('should be symbol, when installed plugin', () => {
  jest.mock('rabi-installer-bar')
  const bar = require('rabi-installer-bar')
  expect(parser('bar')).toBe(bar.lib)
})
