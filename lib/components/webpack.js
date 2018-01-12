/**
 * webpack installer
 *
 * @flow
 */

import flag from '../flag'
import { type Component } from './'

export default Symbol('webpack')

export function install(): Component {
  return [[
    'webpack',
    'webpack-dev-server',
    'webpack-cli',
    'css-loader',
    'style-loader',
    'file-loader',
    'url-loader',
    'extract-text-webpack-plugin',
    'html-webpack-plugin'
  ], {
    flag: flag.D
  }]
}

export function babel(): Component {
  return [['babel-loader']]
}

export function postcss(): Component {
  return [['postcss-loader']]
}

export function sass(): Component {
  return [['sass-loader']]
}
