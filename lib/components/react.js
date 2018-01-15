/**
 * react installer
 *
 * @flow
 */

import { D, P } from '../flag'
import { type Component } from './'

export default 'react'

export function install(): Component {
  return [
    'react',
    'react-dom'
  ]
}

export function babel(): Component {
  return [[
    '@babel/preset-react'
  ], {
    flag: D
  }]
}
