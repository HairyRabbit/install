/**
 * redux installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import type Library from '../interfaces/library'

export default class Redux implements Library {
  id = 'redux';
  lib = 'redux';
  install() {
    return [
      'redux',
      'redux-thunk',
      'redux-logger'
    ]
  }
  react() {
    return 'react-redux'
  }
}
