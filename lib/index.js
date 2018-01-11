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
 *
 * @flow
 * @jsx h
 */

import path from 'path'
import fs from 'fs'
import cmder from './cmder'
import flag from './flag'

/**
 * parser
 */
export const babel = Symbol('babel')
// export const typescript = Symbol('typescript')
// export const coffee = Symbol('coffee')
export const postcss = Symbol('postcss')
export const sass = Symbol('sass')

/**
 * tester
 */
export const jest = Symbol('jest')

/**
 * linter
 */
export const flow = Symbol('flow')

/**
 * packager
 */
export const webpack = Symbol('webpack')
export const rollup = Symbol('webpack')

/**
 * utils
 */
export const lodash = Symbol('lodash')

/**
 * frameworks
 */
export const react = Symbol('react')
export const redux = Symbol('redux')
// export const vue = Symbol('vue')

/**
 * framework addons
 */
export const router = Symbol('router')
// export const animation = Symbol('animation')

type Library =
  | string
  | typeof babel
  | typeof jest
  | typeof flow
  | typeof postcss
  | typeof sass
  | typeof webpack
  | typeof rollup
  | typeof lodash
  | typeof react
  | typeof redux
  | typeof router

export default function installer(libs: Library | Array<Library>, options: Options = {}): Promise<number> {
  /**
   * test libs
   */
  if(!libs || Array.isArray(libs) && 0 === libs.length) {
    Promise.reject(new Error('libs was required.'))
    return
  }

  const cmd = cmder()
  const checker = isInstalled()
  const composed = compose(Array.isArray(libs) ? libs : [libs], checker, options)
  return cmd.install(composed, options)
}


/**
 * compose build-in symbols
 *
 * @TODO pluginable
 * @TODO conflict with different flag
 */
function compose(libs: Array<Library>, checker: string => boolean, options) {
  const collects = []
  const within = withlib(libs, collects, checker)

  libs.forEach(lib => {
    if('string' === typeof lib) {
      collects.push(lib)
      return
    } else {
      switch(lib) {
      case babel: {
        within(null,
               '@babel/core',
               '@babel/preset-env',
               '@babel/plugin-proposal-class-properties',
               '@babel/plugin-proposal-export-default-from',
               '@babel/plugin-proposal-export-namespace-from',
               '@babel/plugin-syntax-dynamic-import',
               '@babel/plugin-proposal-throw-expressions')
        options.flag = flag.D
        break
      }
      case flow:
        within(null, 'flow-bin')
        within(babel, '@babel/present-flow')
        break
      case jest:
        within(null, 'jest')
        within(babel, 'babel-jest', 'babel-core@7.0.0-bridge.0')
        break
      case postcss:
        within(null, 'postcss')
        within(null, 'postcss-next')
        /**
         * @TODO postcss plugins
         */
        break
      case sass:
        within(null, 'node-sass')
        break
      case webpack:
        within(null,
               'webpack@next',
               'webpack-dev-server',
               'webpack-cli',
               'css-loader',
               'style-loader',
               'file-loader',
               'url-loader',
               'extract-text-webpack-plugin',
               'html-webpack-plugin')
        within(babel, 'babel-loader')
        within(postcss, 'postcss-loader')
        within(sass, 'sass-loader')
        break
      case rollup:
        within(null, 'rollup',
          'rollup-plugin-uglify',
          'rollup-plugin-commonjs',
          'rollup-plugin-json',
          'rollup-plugin-node-resolve')
        within(babel, 'rollup-plugin-babel')
        break
      case lodash:
        within(null, 'lodash')
        within(babel, 'babel-plugin-lodash')
        break
      case react:
        within(null, 'react', 'react-dom')
        within(babel, '@babel/preset-react')
        break
      case redux:
        within(null, 'redux')
        within(react, 'react-redux')
        break
      case router:
        within(react, 'react-router', 'react-router-dom', 'history')
        within(redux, 'react-router-redux')
        break
      }
    }
  })

  return collects
}

/**
 * check libs and already installed libs, push libname to collects
 */
function withlib(libs: Array<Library>, collects: Array<Library>, checker: string => boolean, options?: Object) {
  /**
   * find lib from packages.json, yarn lock for yarn,
   * or package-lock.json for npm
   */
  return (lib: Library | null, ...deps: Array<string>): void => {
    /**
     * the default install without any composable.
     */
    if(null === lib || ~libs.indexOf(lib) || checker(lib)) {
      deps.forEach(dep => {
        collects.push(dep)
      })
    }
  }
}


function isInstalled() {
  let installed = []

  let pkg
  try {
    pkg = JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(), 'package.json')
        , 'utf-8'
      )
    )

    installed = []
      .concat(pkg.devDependencies && Object.keys(pkg.devDependencies) || [])
      .concat(pkg.dependencies && Object.keys(pkg.dependencies) || [])
      .map(parselib)
  } catch(error) {
    throw new Error(error)
  }

  return (lib: Library): boolean => {
    if(0 === installed.length) {
      /**
       * no need to check
       */
      return false
    } else {
      return Boolean(~installed.indexOf(lib))
    }
  }
}

export function parselib(lib: string): Library {
  switch(lib) {
  case '@babel/core':
    return babel
  case 'flow':
    return flow
  case 'jest':
    return jest
  case 'postcss':
    return postcss
  case 'node-sass':
    return sass
  case 'webpack':
    return webpack
  case 'rollup':
    return rollup
  case 'lodash':
    return lodash
  case 'react':
    return react
  case 'redux':
    return redux
  case 'react-router':
    return router
  default:
    return lib
  }
}

export { reverse as reverseflag } from './flag'
