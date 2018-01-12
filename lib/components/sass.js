/**
 * sass installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('sass')

export function install(): Component {
  return [[
    'node-sass',
  ], {
    flag: flag.D
  }]
}
