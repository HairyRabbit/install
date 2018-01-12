/**
 * react installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('react')

export function install(): Component {
  return [[
    'react',
    'react-dom'
  ]]
}

export function babel(): Component {
  return [['@babel/preset-react']]
}
