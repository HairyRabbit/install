/**
 * jest installer
 *
 * @flow
 */

import { D } from '../flag'
import { type Component } from './'

export default 'jest'

export function install(): Component {
  return [[
    'jest'
  ], {
    flag: D
  }]
}

export function babel(): Component {
  return [[
    'babel-jest',
    'babel-core@7.0.0-bridge.0'
  ], {
    flag: D
  }]
}
