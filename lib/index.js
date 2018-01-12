/**
 * library-install
 *
 * Install a node module use yarn or npm
 *
 * @example
 *
 * ```js
 * import install from 'library-install'
 *
 * // Basic usage
 * install('react').then(output => console.log(output))
 *
 * install('react', { dev: true })
 * ```
 */

import path from 'path'
import fs from 'fs'
import { merge } from './provider'
import cmder from './cmder'
import flag from './flag'
import checker from './checker'
import { toString } from './parser'
import { type Library } from './symbols'

export default function installer(libs: Library | Array<Library>, options: Options = {}): Promise<number> {
  /**
   * test libs
   */
  if(!libs || Array.isArray(libs) && 0 === libs.length) {
    Promise.reject(new Error('libs was required.'))
    return
  }

  const cmd = cmder()
  const installed = checker(options.cwd)
  const composed = compose(Array.isArray(libs) ? libs : [libs], installed, options)
  return cmd.install(composed, options)
}

/**
 * compose build-in symbols
 *
 * @TODO pluginable
 * @TODO conflict with different flag
 */
function compose(libs: Array<Library>, checker, options = {}) {
  const collects = []

  const installed = {}
  if(checker) {
    checker.filter(c => 'symbol' === typeof c).forEach(c => {
      installed[toString(c)] = require('./components/' + toString(c))
    })
  }

  const buildins = {}
  libs.filter(c => 'symbol' === typeof c).forEach(c => {
    buildins[toString(c)] = require('./components/' + toString(c))
  })

  console.log('INSTALLED')
  console.log(installed)

  libs.forEach(lib => {
    if('string' === typeof lib) {
      collects.push(lib)
      return
    } else if('symbol' === typeof lib) {
      /**
       * when lib was a symbol
       */
      const component = require('./components/' + toString(lib))
      dispose(component.install, collects, options)

      /**
       * run self hooks
       */
      Object.keys(installed).filter(key => component[key]).forEach(key => {
        dispose(component[key], collects, options)
      })

      /**
       * run other hooks
       * check all installed symbols, and call same named hooks
       */
      if(Object.keys(installed).length) {
        Object.keys(installed).forEach(key => {
          const caller = installed[key][toString(lib)]
          caller && dispose(caller, collects, options)
        })
      }

      /**
       * if buildin libs more then one, run each other hooks
       */
      if(Object.keys(buildins).length) {
        Object.keys(buildins).forEach(key => {
          const caller = buildins[key][toString(lib)]
          caller && dispose(caller, collects, options)
        })
      }

    } else {
      throw new Error('Unsupported lib type ' + typeof lib)
    }
  })

  return collects
}

function dispose(caller, collects, options): void {
  const [libs, opts] = caller()
  libs.forEach(lib => {
    collects.push(lib)
  })
  Object.assign(options, merge(options, opts || {}))
}
