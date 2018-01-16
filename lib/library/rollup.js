/**
 * rollup installer
 *
 * @flow
 */

import { D } from '../flag'
import type Library from '../interfaces/library'

const packages = [
  'rollup',
  'rollup-plugin-uglify',
  'rollup-plugin-commonjs',
  'rollup-plugin-json',
  'rollup-plugin-node-resolve'
]

export default class Rollup implements Library {
  id = 'rollup';
  lib = 'rollup';
  install() {
    return [packages, D]
  }
  babel() {
    return ['rollup-plugin-babel', D]
  }
}
