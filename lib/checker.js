/**
 * check the lib was installed
 *
 * @flow
 */

import fs from 'fs'
import path from 'path'
import parser from './parser'
import { type Library } from './symbols'

export default function checker(cwd?: string): ?Array<Library> {
  let installed = [], pkg
  try {
    /**
     * find package.json
     */
    pkg = JSON.parse(
      fs.readFileSync(
        path.resolve(cwd || process.cwd(), 'package.json')
        , 'utf-8'
      )
    )

    /**
     * add deps name to installed, but the lib was really installed?
     */
    return Object.keys(Object.assign(
      {},
      pkg.devDependencies,
      pkg.dependencies
    )).map(parser)
  } catch(error) {
    /**
     * should not throw for init install
     */
    return null
  }
}
