/**
 * sass installer
 *
 * @flow
 */

import { D } from '../flag'
import { type Component } from './'

export default Symbol('sass')

export const token = 'node-sass'

export function install(): Component {
  return [[
    'node-sass',
  ], {
    flag: D
  }]
}
