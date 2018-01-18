/**
 * @jest
 */

import { D, P, O } from '../lib/flag'
import Provider from '../lib/provider'
import merge from '../lib/optionsCombiner'

beforeEach(() => {
  jest.resetModules()
})

test('constructor', () => {
  const provider = new Provider('foo', 'bar')
  expect(provider.name).toBe('foo')
  expect(provider.installCmd).toBe('bar')
  expect(provider.options).toEqual({
    flag: P,
    log: false,
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
    .toEqual(['foo', ['bar', 'baz', '--silent', '--no-progress'], {}])
})

test('make complex options', () => {
  const provider = new Provider('foo', 'bar', {})
  Object.defineProperty(process, 'platform', {
    value: null
  })
  expect(provider.makeOptions(['baz', 'qux'], merge({ flag: D })))
    .toEqual(['foo', ['bar', 'baz', 'qux', '-D', '--silent', '--no-progress'], {}])
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
    .toEqual(['foo', ['bar', 'baz', '--silent', '--no-progress'], {
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
    .toEqual(['foo', ['bar', 'baz', '-O', '--silent', '--no-progress'], {}])
})

/**
 * install
 */

jest.mock('child_process')

test('install', () => {
  jest.doMock('child_process', () => {
    return {
      spawn() {
        return {
          stdout: { on(str, cb) { cb('') } },
          stderr: { on(str, cb) { cb('') } },
          on(str, cb) { cb(0) }
        }
      }
    }
  })
  const ProvideModule = require('../lib/provider').default
  const provider = new ProvideModule('foo', 'bar')
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
  jest.doMock('child_process', () => {
    return {
      spawn() {
        return {
          stdout: { on(str, cb) { cb('') } },
          stderr: { on(str, cb) { cb('') } },
          on(str, cb) { cb(2) }
        }
      }
    }
  })

  const ProvideModule = require('../lib/provider').default
  const provider = new ProvideModule('foo', 'bar')
  return expect(provider.install(['baz']))
    .rejects.toThrow('Install task failed.')
})
