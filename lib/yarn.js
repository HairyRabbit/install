/**
 * yarn provider
 *
 * @flow
 */

import Provider from './provider'
import type { Options } from './interfaces/options'

export const DefaultOptions: Options = {
  addOptions: [
    '--prefer-offline'
  ]
}

export default class Yarn extends Provider {
  constructor(cmd: string, options?: Options = DefaultOptions) {
    super(cmd, 'add', options)
  }
  toString() {
    return 'yarn'
  }
}
