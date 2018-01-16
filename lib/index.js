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

import fs from 'fs'
import pkgup from 'pkg-up'
import cmder from './cmder'
import { D, P, O } from './flag'
import merge from './optionsCombiner'
import findPlugins from './pluginResolver'
import parseLib from './libnameParser'
import parseOpts, { NotFoundError } from './argvParser'
import parseModule from './moduleParser'
import * as buildins from './library'
import type { Library } from './interfaces/library'
import type { Options } from './interfaces/options'

export default function installer(libs: string | Array<string>, options: Options = {}, cli?: boolean = false): Promise<void> {
  /**
   * ensure provied lib
   */
  if(!libs || Array.isArray(libs) && 0 === libs.length) {
    return Promise.reject(NotFoundError)
  }

  /**
   * find plugins, named '@rabbitcc/install-library-NAME'
   */
  let plugins = findPlugins()
  plugins = plugins && plugins.library || {}

  /**
   * combine library with plugins
   */
  const library = {
      ...buildins,
      ...plugins
  }

  /**
   * parse libs name
   */
  const parseLibname = parseLib(library)
  libs = Array.isArray(libs) ? libs : [libs]
  libs = libs.map(parseLibname)

  /**
   * find targets from libs
   */
  const targets = {}
  libs.forEach(Lib => {
    if('string' !== typeof Lib) {
      const libInstance = new Lib()
      targets[libInstance.id] = libInstance
    }
  })

  /**
   * resolve installed library from `package.json`
   */
  const pkgPath = pkgup.sync()
  if(pkgPath) {
    /**
     * need fetch package.json without cache
     */
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const deps = {
        ...pkg.devDependencies,
        ...pkg.dependencies
    }
    const parseModname = parseModule(library)
    const keys = Object.keys(deps).map(parseModname)
    if(keys.length) {
      keys.forEach(Mod => {
        if('string' !== typeof Mod) {
          const libInstance = new Mod()
          const id = libInstance.id
          if(!targets[id]) {
            targets[id] = libInstance
          }
        }
      })
    }
  }

  /**
   * run install
   */
  const cmd = cmder()
  if(cli) {
    options.log = true
  }
  const composed = compose(libs, targets, options)
  return cmd.install.apply(cmd, composed)
}

/**
 * compose build-in symbols
 *
 * @TODO pluginable
 * @TODO conflict with different flag
 */
function compose(libs: Array<Library>, targets, options = {}): [Array<string>, Options] {
  const collects = []
  const _options = options
  libs.forEach(lib => {
    if('string' === typeof lib) {
      collects.push(lib)
      return
    } else {
      lib = new lib()
      /**
       * when lib was a Library(Object), dispose itself
       * run the `Library#install`
       */
      dispose(lib.install, collects)

      /**
       * run library self hooks, e.g the `Webpack` has `babel()` hook,
       * if we both install webpack and babel, or babel already installed,
       * need run `Webpack#babel`
       */
      Object.keys(targets).filter(key => Boolean(lib[key])).forEach(id => {
        dispose(lib[id], collects)
      })

      /**
       * run hooks from other library, e.g if we want to install `babel`,
       * and already installed `webpack`, need run `Webpack#babel` hook
       * check all targets, and call same named hooks
       */
      Object.keys(targets).forEach(id => {
        if(id !== lib.id) {
          const caller = targets[id][lib.id]
          caller && dispose(caller, collects)
        }
      })
    }
  })

  /**
   * remove duplicate item
   */
  return [[...new Set(collects)], merge(options, _options)]

  /**
   * update collects and options mutable
   */
  function dispose(hook: Function, collects: Array<Library>): void {
    const result = hook()
    let libs, opts
    if(!Array.isArray(result)) {
      /**
       * match 'foo'
       */
      libs = [libs]
    } else if(2 === result.length && ~[D, P, O].indexOf(result[1])){
      /**
       * match [['foo'], D] or ['foo', D]
       */
      libs = Array.isArray(result[0]) ? result[0] : [result[0]]
      opts = result[1]
    } else if(1 === result.length && Array.isArray(result[0])) {
      /**
       * match [['foo']]
       */
      libs = result[0]
    } else {
      /**
       * match ['foo']
       */
      libs = result
    }

    for(let i = 0; i < libs.length; i++) {
      collects.push(libs[i])
    }

    /**
     * make options
     */
    if(~[D, P, O].indexOf(opts) && 'object' !== typeof opts) {
      opts = {
        flag: opts
      }
    }

    options = merge(options, opts)
  }
}

export { parseOpts }
