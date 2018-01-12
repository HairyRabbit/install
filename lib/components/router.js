/**
 * router installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('router')

export function install(): Component {
  return [[], {}]
}

export function react(): Component {
  return [['react-router', 'react-router-dom', 'history']]
}

export function redux(): Component {
  return [['react-router-redux']]
}

/**
 * TODO implements precheck
 */
redux.preprocess = react
