import parsepkg from '../lib/parsepkg';

test('should be react', () => {
  expect(parsepkg('react', { react: 42 })).toBe(42);
});

test('should be babel', () => {
  const babel = {
    default: Symbol('babel'),
    token: ['babel-core', '@babel/core']
  }
  expect(parsepkg('babel-core', { babel })).toBe(babel);
  expect(parsepkg('@babel/core', { babel })).toBe(babel);
  expect(parsepkg('foo', { babel })).toBe('foo');
});

test('should be sass', () => {
  const sass = {
    default: Symbol('sass'),
    token: 'node-sass'
  }
  expect(parsepkg('node-sass', { sass })).toBe(sass);
});

test('should be router', () => {
  expect(parsepkg('react-router', { router: 42 })).toBe(42);
});
