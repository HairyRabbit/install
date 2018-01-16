/**
 * babel installer
 *
 * @flow
 */

import fs from 'fs';
import path from 'path';
import { D } from '../flag';
import { type Component } from './';
import type Library from '../interfaces/library'

// export default Symbol('babel');

export const token = ['babel-core', '@babel/core'];

const packages = [
  '@babel/core',
  '@babel/preset-env',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-throw-expressions'
];

export function install(): Component {
  return [packages, { flag: D }];
}

export function uninstall(): Component {
  return packages;
}

const babelConfig: Object = {
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "node": true
      },
      "modules": false,
      "loose": true
    }]],
  "plugins": [
    ["@babel/plugin-proposal-class-properties", {
      "loose": true
    }],
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-export-namespace-from",
    ["@babel/plugin-proposal-object-rest-spread", {
      "useBuiltIns": true
    }],
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-throw-expressions"
  ]
};

export function onInstall(context: string): Promise<void> {
  return new Promise(function(resolve, reject) {
    const configPath = path.resolve(context, '.babelrc');
    const isExists = fs.existsSync(configPath);
    if(isExists) {
      /**
       * file was exists
       */
      resolve();
    } else {
      fs.writeFile(configPath, JSON.stringify(babelConfig), function(error) {
        if(error) {
          reject(error);
          return;
        }

        resolve();
      });
    }
  });
}


export default class Babel implements Library {
  id = 'babel';
  lib = ['babel-core', '@babel/core'];
  install() {
    return [packages, D]
  }
}
