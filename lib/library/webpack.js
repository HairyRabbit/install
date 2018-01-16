/**
 * webpack installer
 *
 * @flow
 */

import { D } from '../flag'
import type Library from '../interfaces/library'

const packages = [
  'webpack',
  'webpack-dev-server',
  'webpack-cli',
  'css-loader',
  'style-loader',
  'file-loader',
  'url-loader',
  'extract-text-webpack-plugin',
  'html-webpack-plugin',
  'html-webpack-template',
  'uglifyjs-webpack-plugin'
]

export default class Webpack implements Library {
  id = 'webpack';
  lib = 'webpack';
  install() {
    return [packages, D]
  }
  babel() {
    return ['babel-loader', D]
  }
}
