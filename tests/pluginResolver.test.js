/**
 * @jest
 */

import path from 'path'
import resolve from '../lib/pluginResolver'

beforeEach(() => {
  jest.resetModules()
})

test('should return null when not find package.json', () => {
  jest.mock('pkg-up', () => null)
  expect(resolve()).toBe(null)
})

test('should return null, when can\'t find any plugins', () => {
  expect(resolve()).toBe(null)
})

test('resolve library', () => {
  jest.doMock(path.resolve('./package.json'), () => {
    return {
      devDependencies: {
        "@rabbitcc/install-library-foo": "42"
      }
    }
  }, { virtual: true })

  jest.doMock('@rabbitcc/install-library-foo', () => {
    return class { id = 'foo' }
  }, { virtual: true })

  const Foo = resolve().library.foo
  expect(typeof Foo).toEqual('function')
  expect(new Foo().id).toBe('foo')
})

test('should resolve library, when export as a list ', () => {
  jest.doMock(path.resolve('./package.json'), () => {
    return {
      devDependencies: {
        "@rabbitcc/install-library-foo": "42"
      }
    }
  }, { virtual: true })

  jest.doMock('@rabbitcc/install-library-foo', () => {
    return {
      bar: class { id = 'bar' },
      baz: class { id = 'baz' }
    }
  }, { virtual: true })

  const libraries = resolve().library
  expect(typeof libraries).not.toEqual('function')
  const Bar = libraries.bar
  expect(typeof Bar).toEqual('function')
  expect(new Bar().id).toEqual('bar')
  const Baz = libraries.baz
  expect(typeof Baz).toEqual('function')
  expect(new Baz().id).toEqual('baz')
})

test.skip('should override build in library', () => {

})
