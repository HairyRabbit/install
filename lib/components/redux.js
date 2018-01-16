/**
 * redux installer
 *
 * @flow
 */

import { D } from '../flag'
import { type Component } from './'

export default 'redux'

export function install(): Component {
  return [[
    'redux',
    'redux-thunk'
  ], [[
    'redux-logger'
  ], {
    flag: D
  }]]
}

export function react(): Component {
  return [
    'react-redux'
  ]
}
