import { D, P, O } from '../lib/flag';
import redner from '../lib/flagGenerator';

test('render default', () => {
  expect(redner(P)).toBe('');
  expect(redner(42)).toBe('');
});

test('render dev', () => {
  expect(redner(D)).toBe('-D');
});

test('render optional', () => {
  expect(redner(O)).toBe('-O');
});
