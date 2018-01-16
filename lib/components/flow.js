/**
 * flow installer
 *
 * @flow
 */

import { D } from '../flag'
import { type Component } from './'

export default 'flow-bin'

export function install(): Component {
  return [[
    'flow-bin'
  ], {
    flag: D
  }]
}

export function babel(): Component {
  return [[
    '@babel/preset-flow'
  ], {
    flag: D
  }]
}
