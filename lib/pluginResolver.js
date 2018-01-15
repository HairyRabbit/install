/**
 * find plugin from 'package.json'
 *
 * @flow
 */

import { sync as pkgup } from 'pkg-up'

const libraryRegexp = /^@rabbitcc\/install-library-/

export default function(): ?{ library: Array<*> } {
  let pkg = pkgup()
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
    const lib = require(deps[key])
    library[lib.id] = lib
  })

  return {
    library
  }
}
