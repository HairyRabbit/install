/**
 * webpack installer
 *
 * @flow
 */

import { D } from '../flag'
import { type Component } from './'

export default 'webpack'

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
    'html-webpack-plugin',
    'html-webpack-template',
    'uglifyjs-webpack-plugin'
  ], {
    flag: D
  }]
}

export function babel(): Component {
  return [[
    'babel-loader'
  ], {
    flag: D
  }]
}

export function postcss(): Component {
  return [[
    'postcss-loader'
  ], {
    flag: D
  }]
}

export function sass(): Component {
  return [[
    'sass-loader'
  ], {
    flag: D
  }]
}
