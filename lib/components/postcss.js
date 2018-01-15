/**
 * postcss installer
 *
 * @flow
 */

import { D } from '../flag'
import { type Component } from './'

export default 'postcss'

export function install(): Component {
  return [[
    'postcss',
    'postcss-next'
  ], {
    flag: D
  }]
}
