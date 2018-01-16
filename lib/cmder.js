/**
 * find cmder
 *
 * @flow
 */

import { sync as which } from 'which'
import { existsSync as exists } from 'fs'
import path from 'path'
import Yarn from './yarn'
import Npm from './npm'

type YarnUseable = string
type NpmUseable = string
type Cmder =
  | Yarn
  | Npm

/**
 * @testable
 */
function useable(): [YarnUseable, NpmUseable] {
  const options = {
    path: process.env.PATH || process.env.Path,
    nothrow: true
  }
  return [which('yarn', options), which('npm', options)]
}

export function checkLockFileExists(flag: string): boolean {
  const current = process.cwd()
  switch(flag) {
    case 'yarn':
      return exists(path.resolve(current, 'yarn.lock'))
    case 'npm':
      return exists(path.resolve(current, 'package-lock.json'))
    default:
      return false
  }
}

export default function finder(): Cmder {
  const [yarn, npm] = useable()
  if(Number(yarn) ^ Number(npm)) {
    if(!yarn) {
      throw new Error(`Can't find yarn or npm in your PATH`)
    } else {
      /**
       * now npm and yarn are all useable.
       * then check the yarn.lock or package-lock.json
       * but, why not use yarn by default ???
       */
      if(checkLockFileExists('yarn')) {
        return new Yarn(yarn)
      } else if(checkLockFileExists('npm')) {
        return new Npm(npm)
      } else {
        /**
         * maybe a green project :)
         */
        return new Yarn(yarn)
      }
    }
  } else {
    if(yarn) {
      return new Yarn(yarn)
    } else {
      return new Npm(npm)
    }
  }
}
