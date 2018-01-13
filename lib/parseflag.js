/**
 * parse flag, return matched flag
 *
 * @flow
 */

import { D, P, O, type Flag } from './flag';

export default function parse(flag?: string): Flag {
  switch(flag) {
    case '--dev':
    case '--save-dev':
    case '-D':
    case '--development':
      return D;
    case '--optional':
    case 'save-optional':
    case '-O':
      return O;
    case '--prod':
    case '-P':
    case '--save':
    case '--production':
    case 'no-save':
    default:
      return P;
  }
}
