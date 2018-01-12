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
  D: Symbol('D'),
  P: Symbol('P'),
  O: Symbol('O'),
  _: Symbol('_')
}

export type Flag = $Values<typeof flag>

export function toString(f: Flag): string {
  switch(f) {
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

export function parse(f: string): ?Flag {
  switch(f) {
  case '--dev':
  case '-D':
    return flag.D
  case '--prod':
  case '-P':
    return flag.P
  case '--optional':
  case '-O':
    return flag.O
  default:
    return flag._
  }
}

export default flag
