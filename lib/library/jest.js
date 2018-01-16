/**
 * jest installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import type Library from '../interfaces/library'

export default class Jest implements Library {
  id = 'jest';
  lib = 'jest';
  install() {
    return ['jest', D]
  }

  babel() {
    return [[
      'babel-jest',
      'babel-core@7.0.0-bridge.0'
    ], D]
  }
}
