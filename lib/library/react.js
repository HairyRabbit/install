/**
 * react installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import type Library from '../interfaces/library'

export default class React implements Library {
  id = 'react';
  lib = 'react';
  install() {
    return [
      'react',
      'react-dom'
    ]
  }
}
