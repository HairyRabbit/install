/**
 * merge two options
 *
 * @flow
 */

import { P } from './flag'
import type Options from './interfaces/options'

export default function merge(opt1: Options = {}, opt2: Options = {}): Options {
  const {
    log: log1,
    flag: flag1,
    addOptions: addOptions1 = [],
    spawnOptions: spawnOptions1 = {}
  } = opt1
  const {
    log: log2,
    flag: flag2,
    addOptions: addOptions2 = [],
    spawnOptions: spawnOptions2 = {}
  } = opt2

  return {
    log: log2 || log1,
    flag: flag2 || flag1 || P,
    addOptions: [...new Set([
      ...addOptions1,
      ...addOptions2
    ])],
    spawnOptions: {
      ...spawnOptions1,
      ...spawnOptions2
    }
  }
}
