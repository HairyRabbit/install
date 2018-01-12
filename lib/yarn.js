/**
 * yarn provider
 *
 * @flow
 */

import Provider, { type Options } from './provider'

export const DefaultOptions: Options = {
  addOptions: [
    '--prefer-offline',
    '--silent',
    '--no-progress'
  ]
}

export default class Yarn extends Provider {
  constructor(options?: Options = DefaultOptions) {
    super('yarn', 'add', options)
  }
}
