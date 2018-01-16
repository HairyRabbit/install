/**
 * flow installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import type Library from '../interfaces/library'

export default class Flow implements Library {
  id = 'flow';
  lib = 'flow-bin';
  install() {
    return ['flow-bin', D]
  }

  babel() {
    return ['@babel/preset-flow', D]
  }
}
