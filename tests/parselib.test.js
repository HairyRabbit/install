import parselib from '../lib/parselib';

test('should be babel', () => {
  expect(parselib('babel', { babel: 42 })).toBe(42);
});

test('should throw', () => {
  function runner() {
    parselib('babel', { foo: 42 });
  }
  expect(runner).toThrow('Unspported library babel');
});
