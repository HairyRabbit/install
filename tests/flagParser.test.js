import { D, P, O, _ } from '../lib/flag';
import parseFlag from '../lib/flagParser';

test('should be default', () => {
  expect(parseFlag()).toBe(P);
});

test('shoud be dev', () => {
  expect(parseFlag('--dev')).toBe(D);
  expect(parseFlag('--development')).toBe(D);
  expect(parseFlag('-D')).toBe(D);
});

test('shoud be prod', () => {
  expect(parseFlag('--prod')).toBe(P);
  expect(parseFlag('--production')).toBe(P);
  expect(parseFlag('-P')).toBe(P);
});

test('shoud be optional', () => {
  expect(parseFlag('--optional')).toBe(O);
  expect(parseFlag('-O')).toBe(O);
});
