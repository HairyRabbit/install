/**
 * redux installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('redux')

export function install(): Component {
  return [[
    'redux',
  ]]
}

export function react(): Component {
  return [['react-redux']]
}
