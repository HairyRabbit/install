/**
 * render flag
 *
 * @flow
 */

import { D, P, O, type Flag } from './flag'

export default function render(flag: Flag): string {
  switch(flag) {
    case D:
      return '-D'
    case O:
      return '-O'
    case P:
    default:
      return ''
  }
}
