/**
 * build-in symbols
 *
 * @flow
 */

/**
 * parser
 */
const babel = Symbol('babel')
// const typescript = Symbol('typescript')
// const coffee = Symbol('coffee')
const postcss = Symbol('postcss')
const sass = Symbol('sass')

/**
 * tester
 */
const Jest = Symbol('jest')

/**
 * linter
 */
const flow = Symbol('flow')

/**
 * packager
 */
const webpack = Symbol('webpack')
const rollup = Symbol('webpack')

/**
 * utils
 */
const lodash = Symbol('lodash')

/**
 * frameworks
 */
const react = Symbol('react')
const redux = Symbol('redux')
// const vue = Symbol('vue')

/**
 * framework addons
 */
const router = Symbol('router')
// const animation = Symbol('animation')

export type Library =
  | string
  | typeof babel
  | typeof Jest
  | typeof flow
  | typeof postcss
  | typeof sass
  | typeof webpack
  | typeof rollup
  | typeof lodash
  | typeof react
  | typeof redux
  | typeof router

export default {
  babel,
  flow,
  jest: Jest,
  postcss,
  sass,
  webpack,
  rollup,
  lodash,
  react,
  redux,
  router
}
