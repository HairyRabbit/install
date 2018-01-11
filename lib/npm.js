/**
 * npm provider
 *
 * @flow
 */

import Provider from './provider'

export const DefaultOptions = {
  addOptions: [
    '--silent',
    '--no-progress'
  ]
}

export default class Npm extends Provider {
  constructor(options = DefaultOptions) {
    super('npm', 'install', options)
  }
}
