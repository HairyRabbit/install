/**
 * parser lib name to symbol
 *
 * @flow
 */

import buildin, { type Library } from './symbols'

export default function parser(lib: string): Library {
  switch(lib) {
    case 'babel-core':
    case '@babel/core':
      return buildin.babel
    case 'flow':
      return buildin.flow
    case 'jest':
      return buildin.jest
    case 'postcss':
      return buildin.postcss
    case 'node-sass':
      return buildin.sass
    case 'webpack':
      return buildin.webpack
    case 'rollup':
      return buildin.rollup
    case 'lodash':
      return buildin.lodash
    case 'react':
      return buildin.react
    case 'redux':
      return buildin.redux
    case 'react-router':
      /**
       * router as the special one, if both react-router and vue-router
       * all exists, which one should be choose?
       */
      return buildin.router
    default:
      /**
       * otherwise, if not matched, check the plugins was installed
       * if not return itself
       */
      return resolve(lib) || lib
  }
}

function resolve(lib: string): ?Symbol {
  try {
    const addons = require('rabi-installer-' + lib)
    return addons.lib
  } catch(e) {
    return null
  }
}


export function toString(lib: Library): string {
  switch(lib) {
    case buildin.babel:
      return 'babel'
    case buildin.flow:
      return 'flow'
    case buildin.jest:
      return 'jest'
    case buildin.postcss:
      return 'postcss'
    case buildin.sass:
      return 'sass'
    case buildin.webpack:
      return 'webpack'
    case buildin.rollup:
      return 'rollup'
    case buildin.lodash:
      return 'lodash'
    case buildin.react:
      return 'react'
    case buildin.redux:
      return 'redux'
    case buildin.router:
      return 'router'
    default:
      return ''
  }
}
