/**
 * router installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import type Library from '../interfaces/library'

export default class Router implements Library {
  id = 'router';
  lib = 'react-router';
  install() {
    return []
  }
  react() {
    return [
      'react-router',
      'react-router-dom'
    ]
  }
  redux() {
    return [
      'history',
      'react-router-redux'
    ]
  }
}
