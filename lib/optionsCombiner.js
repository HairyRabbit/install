/**
 * merge two options
 *
 * @flow
 */

import { P } from './flag'
import type Options from './interfaces/options'

export default function merge(opt1: Options = {}, opt2: Options = {}): Options {
  const {
    flag: flag1,
    addOptions: addOptions1 = [],
    spawnOptions: spawnOptions1 = {}
  } = opt1
  const {
    flag: flag2,
    addOptions: addOptions2 = [],
    spawnOptions: spawnOptions2 = {}
  } = opt2

  return {
    flag: flag2 || flag1 || P,
    addOptions: [
      ...addOptions1,
      ...addOptions2
    ],
    spawnOptions: {
      ...spawnOptions1,
      ...spawnOptions2
    }
  }
}
