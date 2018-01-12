/**
 * npm provider
 *
 * @flow
 */

import Provider, { type Options } from './provider'

export const DefaultOptions: Options = {
  addOptions: [
    '--silent',
    '--no-progress'
  ]
}

export default class Npm extends Provider {
  constructor(options?: Options = DefaultOptions) {
    super('npm', 'install', options)
  }
}
