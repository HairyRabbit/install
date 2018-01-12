/**
 * lodash installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('lodash')

export function install(): Component {
  return [[
    'lodash'
  ], {
    flag: flag.D
  }]
}

export function babel(): Component {
  return [['babel-plugin-lodash']]
}
