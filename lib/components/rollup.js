/**
 * rollup installer
 *
 * @flow
 */

import { D } from '../flag'
import { type Component } from './'

export default 'rollup'

export function install(): Component {
  return [[
    'rollup',
    'rollup-plugin-uglify',
    'rollup-plugin-commonjs',
    'rollup-plugin-json',
    'rollup-plugin-node-resolve'
  ], {
    flag: D
  }]
}

export function babel(): Component {
  return [[
    'rollup-plugin-babel',
  ], {
    flag: D
  }]
}
