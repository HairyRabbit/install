/**
 * sass installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import type Library from '../interfaces/library'

export default class Sass implements Library {
  id = 'sass';
  lib = 'node-sass';
  install() {
    return ['node-sass', D]
  }
}
