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

const flag = {
  D: Symbol(),
  P: Symbol(),
  O: Symbol()
}

export type Flag = $Values<flag>

export function toString(flag: Flag): string {
  switch(flag) {
    case flag.D:
      return '--dev'
    case flag.P:
      return '--peer'
    case flag.O:
      return '--optional'
    default:
      return ''
  }
}

export default flag
