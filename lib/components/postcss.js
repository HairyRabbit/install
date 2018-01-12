/**
 * postcss installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('postcss')

export function install(): Component {
  return [[
    'postcss',
    'postcss-next'
  ], {
    flag: flag.D
  }]
}
