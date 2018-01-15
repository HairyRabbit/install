/**
 * lodash installer
 *
 * @flow
 */

import { D } from '../flag'
import { type Component } from './'

export default 'lodash'

export function install(): Component {
  return [[
    'lodash'
  ], {
    flag: D
  }]
}

export function babel(): Component {
  return [[
    'babel-plugin-lodash'
  ], {
    flag: D
  }]
}
