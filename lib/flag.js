/**
 * add process flag, install packages to:
 *
 *   D - devDependencies
 *   P - peerDependencies
 *   O - optionalDependencies
 *
 * `dependencies` by default
 *
 * @flow
 */

export const D = Symbol('D')
export const P = Symbol('P')
export const O = Symbol('O')

export default {
  D,
  P,
  O,
}

export type Flag = {
  D: typeof D,
  p: typeof P,
  O: typeof O
}
