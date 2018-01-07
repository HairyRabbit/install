/**
 * library-install
 *
 * Install a node module use yarn or npm
 *
 * @example
 *
 * ```js
 * import install from 'library-install'
 *
 * // Basic usage
 * install('react').then(output => console.log(output))
 *
 * install('react', { dev: true })
 * ```
 *
 * @flow
 */

import chalk from 'chalk'
import path from 'path'
import fs from 'fs'
import { exec as nativeExec } from 'child_process'

// yarn add --prefer-offline --dev @babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-decorators @babel/plugin-proposal-throw-expressions @babel/preset-env @babel/preset-flow @babel/preset-react

export const cmder = {
  yarn: 'yarn',
  npm: 'npm'
}

export const statue = {
  ready: 'ready',
  done: 'done'
}

export const babel = Symbol()
export const webpack = Symbol()
export const rollup = Symbol()

installer(babel, webpack)

export default function installer(...args) {
  /**
   * validate arguments
   */
  const len = args.length
  if(!len || len === 1 && !~['symbol', 'string'].indexOf(typeof args[0])) {
    throw new Error('No arguments provide')
  }

  /**
   * select libs and options, skip others
   */
  let libs = [], options
  for(let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch(typeof arg) {
    case 'symbol':
    case 'string':
      libs.push(arg)
      break
    case 'object':
      options = arg
      break
    default:
      break
    }
  }

  return create(libs, options)
    .then(commander)
    .then(process(libs))
    .catch(err => {
      throw err
    }).catch(noop)
    .then(log)
}

function process(libs) {
  return context => {
    context.status = statue.ready
    return Promise.all(libs.map(lib => {
      return exec(make(lib, context))
        .then(data => console.log(data))
        .catch(noop)
    })).then(() => {
      context.status = statue.done
      return context
    })
  }
}

function noop() {}

function make(lib, context) {
  const libs = context.libs
  const cmder = context.cmder
  const cmdOptions = context.options

  switch(lib) {
  case babel:
    return `${cmder} add --prefer-offline --dev \
@babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-decorators @babel/plugin-proposal-throw-expressions @babel/preset-env @babel/preset-flow @babel/preset-react`
  case webpack: {
    const hasBabel = libs.some(lib => lib === babel)
    return `${cmder} add --prefer-offline --dev \
webpack@next webpack-cli \
${hasBabel ? 'babel-loader' : ''}`
  }
  default:
    return `${cmder} add --prefer-offline ${lib}`
  }
}

function selectCommander(commander) {
  switch(commander) {
  case cmder.yarn:
    return 'yarn --version'
  case cmder.npm:
    return 'npm1 --version'
  default:
    return commander
  }
}

/**
 * test default commander, yarn or npm if not provide custrom commander
 *
 * @TODO custom commander, e.g. bower
 */
function commander(context) {
  return exec(selectCommander(cmder.yarn))
    .then(() => write({ cmder: cmder.yarn })(context))
    .catch(() => exec(selectCommander(cmder.npm)).then(
      () => write({ cmder: cmder.npm })(context)
    ))
    .catch(() => {
      throw new Error('Commander Not Found')
    })
}

function create(libs, options) {
  const context = {}
  context.libs = libs
  context.options = options
  return Promise.resolve(context)
}

function write(...rest) {
  return context => {
    const args = rest
    args.unshift(context)
    args.unshift({})
    return Object.assign.apply(null, args)
  }
}

function log(context) {
  console.log(context)
  return context
}

function exec(cmd, options = {}) {
  return new Promise(function(resolve, reject) {
    nativeExec(cmd, options, function(err, stdout, stderr) {
      if(err || stderr) return reject(err, stderr)
      resolve(stdout)
    })
  })
}
