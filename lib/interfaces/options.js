/**
 * Options type alias
 *
 * @flow
 */

import type { Flag } from '../flag'

export type Options = {
  flag?: Flag,
  addOptions?: Array<string>,
  spawnOptions?: Object,
  log?: boolean
}
