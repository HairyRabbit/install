/**
 * @jest
 */

import { D, P, O } from '../lib/flag'
import Provider from '../lib/provider'
import merge from '../lib/optionsCombiner'

jest.mock('child_process')

test('constructor', () => {
  const provider = new Provider('foo', 'bar')
  expect(provider.name).toBe('foo')
  expect(provider.installCmd).toBe('bar')
  expect(provider.options).toEqual({
    flag: P,
    addOptions: [],
    spawnOptions: {}
  })
})

test('constructor with default options', () => {
  const provider = new Provider('foo', 'bar', { spawnOptions: { stdio: 'pipe' } })
  expect(provider.name).toBe('foo')
  expect(provider.installCmd).toBe('bar')
  expect(provider.options).toEqual({
    spawnOptions: {
      stdio: 'pipe'
    }
  })
})

/**
 * make options
 */
test('make simple options', () => {
  const provider = new Provider('foo', 'bar', {})
  Object.defineProperty(process, 'platform', {
    value: null
  })
  expect(provider.makeOptions(['baz'], merge()))
    .toEqual(['foo', ['bar', 'baz', ''], {}])
})

test('make complex options', () => {
  const provider = new Provider('foo', 'bar', {})
  Object.defineProperty(process, 'platform', {
    value: null
  })
  expect(provider.makeOptions(['baz', 'qux'], merge({ flag: D })))
    .toEqual(['foo', ['bar', 'baz', 'qux', '-D'], {}])
})

test('match cmd name for win platform', () => {
  const provider = new Provider('foo', 'bar', {})
  Object.defineProperty(process, 'platform', {
    value: 'win32'
  })
  expect(provider.makeOptions(['baz'], merge()))
    .toEqual(['foo.cmd', ['bar', 'baz', ''], {}])
})

test('pass to spawn options', () => {
  const provider = new Provider('foo', 'bar')
  Object.defineProperty(process, 'platform', {
    value: null
  })
  expect(provider.makeOptions(['baz'], merge({
    spawnOptions: {
      stdio: 'pipe'
    }
  })))
    .toEqual(['foo', ['bar', 'baz', ''], {
      stdio: 'pipe'
    }])
})

test('render the flag', () => {
  const provider = new Provider('foo', 'bar')
  Object.defineProperty(process, 'platform', {
    value: null
  })
  expect(provider.makeOptions(['baz'], merge({
    flag: O
  })))
    .toEqual(['foo', ['bar', 'baz', '-O'], {}])
})

/**
 * install
 */

test('install', () => {
  const provider = new Provider('foo', 'bar')

  return expect(provider.install(['baz'])).resovles
})

test('install without provide lib', () => {
  const provider = new Provider('foo', 'bar')

  function runner() {
    provider.install()
  }

  expect(runner).toThrow()
})

test('install failed', () => {
  const provider = new Provider('foo', 'bar')
  return expect(provider.install(['baz']))
    .rejects.toThrow('Install task failed.')
})
