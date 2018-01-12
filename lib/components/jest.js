/**
 * jest installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('jest')

export function install(): Component {
  return [[
    'jest'
  ], {
    flag: flag.D
  }]
}

export function babel(): Component {
  return [['babel-jest', 'babel-core@7.0.0-bridge.0']]
}
