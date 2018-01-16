/**
 * router installer
 *
 * @flow
 */

import { type Component } from './'

export default 'router';

export function install(): Component {
  return [];
}

export function react(): Component {
  return [
    'react-router',
    'react-router-dom',
    'history'
  ]
}

export function redux(): Component {
  return [
    'react-router-redux'
  ]
}

/**
 * @TODO: implements precheck
 */
redux.precheck = react
