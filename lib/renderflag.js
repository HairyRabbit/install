/**
 * render flag
 *
 * @flag
 */

import { D, P, O, type Flag } from './flag';

export default function renderflag(flag: Flag): string {
  switch(flag) {
    case D:
      return '-D';
    case O:
      return '-O';
    case P:
    default:
      return '';
  }
}
