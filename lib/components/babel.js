/**
 * babel installer
 *
 * @flow
 */

import flag from '../flag';
import { type Component } from './';

export default ['babel-core', '@babel/core'];

export function install(): Component {
  return [[
    '@babel/core',
    '@babel/preset-env',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-throw-expressions'
  ], {
    flag: flag.D
  }];
}
