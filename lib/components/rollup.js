/**
 * rollup installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('rollup')

export function install(): Component {
  return [[
    'rollup',
    'rollup-plugin-uglify',
    'rollup-plugin-commonjs',
    'rollup-plugin-json',
    'rollup-plugin-node-resolve'
  ], {
    flag: flag.D
  }]
}

export function babel(): Component {
  return [['rollup-plugin-babel']]
}
