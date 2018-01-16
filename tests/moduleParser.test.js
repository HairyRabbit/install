/**
 * @jest
 */

import { babel } from '../lib/library'
import parseModule from '../lib/moduleParser';

// test('should be react', () => {
//   expect(parseModule('react', { react: 42 })).toBe(42);
// });

test('should be babel', () => {
  const parseMod = parseModule({ babel })
  expect(parseMod('babel-core')).toBe(babel);
  expect(parseMod('@babel/core')).toBe(babel);
  expect(parseMod('foo')).toBe('foo');
});

// test('should be sass', () => {
//   const sass = {
//     default: Symbol('sass'),
//     token: 'node-sass'
//   }
//   expect(parseModule('node-sass', { sass })).toBe(sass);
// });

// test('should be router', () => {
//   expect(parseModule('react-router', { router: 42 })).toBe(42);
// });
