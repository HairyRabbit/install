/**
 * postcss installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import type Library from '../interfaces/library'

export default class Postcss implements Library {
  id = 'postcss';
  lib = 'postcss';
  install() {
    return [[
      'postcss',
      'postcss-next'
    ], D]
  }
}
