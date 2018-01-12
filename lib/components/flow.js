/**
 * flow installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('flow')

export function install(): Component {
  return [[
    'flow-bin'
  ], {
    flag: flag.D
  }]
}

export function babel(): Component {
  return [['@babel/preset-flow']]
}
