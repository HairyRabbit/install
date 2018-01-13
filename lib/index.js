/**
 * library-install
 *
 * Install a node module use yarn or npm
 *
 * @example
 *
 * ```js
 * import install from 'rabbit-install'
 *
 * install('react')
 * ```
 *
 * @flow
 */

import { merge, type Options } from './provider'
import cmder from './cmder'
import flag from './flag'
import checker from './checker'
import { toString } from './parser'
import { type Library } from './symbols'

export default function installer(libs: Library | Array<Library>,
                                  options: Options = {}): Promise<number> {
  /**
   * test libs
   */
  if(!libs || Array.isArray(libs) && 0 === libs.length) {
    return Promise.reject(new Error('lib was required.'))
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
function compose(libs: Array<Library>, checker, options = {}): Array<string> {
  const collects = []

  const targets = {}
  if(checker) {
    symbolsFilter(checker, addTarget(targets))
  }
  symbolsFilter(libs, addTarget(targets))

  libs.forEach(lib => {
    if('string' === typeof lib) {
      collects.push(lib)
      return
    } else {
      /**
       * when lib was a symbol
       */
      const component = require('./components/' + toString(lib))
      dispose(component.install, collects, options)

      /**
       * run self hooks
       */
      Object.keys(targets).filter(key => component[key]).forEach(key => {
        dispose(component[key], collects, options)
      })

      /**
       * run other hooks
       * check all targets symbols, and call same named hooks,
       * also libs
       */
      if(Object.keys(targets).length) {
        Object.keys(targets).forEach(key => {
          const caller = targets[key][toString(lib)]
          caller && dispose(caller, collects, options)
        })
      }
    }
  })

  /**
   * delete uniq item
   */
  return Array.from(new Set(collects))
}

export function dispose(caller: Function,
                        collects: Array<string>,
                        options: Options): void {
  const [libs, opts] = caller()
  libs.forEach(lib => {
    collects.push(lib)
  })
  Object.assign(options, merge(options, opts || {}))
}

export function symbolsFilter<T>(list: Array<T>, callback: Function): void {
  list.filter(item => 'symbol' === typeof item).forEach(callback)
}

export function addTarget(targets: *) {
  return (symbol: Symbol) => {
    const name = toString(symbol)
    targets[name] = require('./components/' + name)
  }
}

export { reverse as parselib } from './parser'
export { parse as parseflag } from './flag'
