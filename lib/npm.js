/**
 * npm provider
 *
 * @flow
 */

import Provider from './provider'
import type { Options } from './interfaces/options'

export const DefaultOptions: Options = {
  addOptions: [
  ]
}

export default class Npm extends Provider {
  constructor(cmd: string, options?: Options = DefaultOptions) {
    super(cmd, 'install', options)
  }
  toString() {
    return 'npm'
  }
}
