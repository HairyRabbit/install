/**
 * find plugin from 'package.json'
 *
 * @flow
 */

import pkgup from 'pkg-up'
import type { Library } from './interfaces/library'

const libraryRegexp = /^@rabbitcc\/install-library-([^.]+)$/

export default function(): ?{ library: { [id: string]: Library } } {
  let pkg = pkgup.sync()
  if(!pkg) {
    return null
  } else {
    pkg = require(pkg)
  }

  const deps = {
    ...pkg.devDependencies,
    ...pkg.dependencies
  }

  /**
   * @TODO supports custom cmd
   */
  const keys = Object.keys(deps).filter(key => libraryRegexp.test(key))
  if(!keys.length) {
    return null
  }

  const library = {}

  keys.forEach(key => {
    const lib = require(key)
    const id = key.match(libraryRegexp)[1]
    library[id] = lib
  })

  return {
    library
  }
}
