/**
 * babel installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import type Library from '../interfaces/library'

const packages = [
  '@babel/core',
  '@babel/preset-env',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-throw-expressions'
];

export default class Babel implements Library {
  id = 'babel';
  lib = ['babel-core', '@babel/core'];
  install() {
    return [packages, D]
  }
}
