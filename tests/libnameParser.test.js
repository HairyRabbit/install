/**
 * @jest
 */

import parseLib from '../lib/libnameParser';

test('should be babel', () => {
  expect(parseLib({ babel: 42 })('babel.')).toBe(42);
});

test('should throw', () => {
  function runner() {
    parseLib({ foo: 42 })('babel.');
  }
  expect(runner).toThrow();
});

test('should parse normal library name', () => {
  expect(parseLib({})('foo')).toBe('foo');
});
