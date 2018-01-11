/**
 * command provider
 *
 * @flow
 */

import { platform } from 'os'
import { spawn } from 'child_process'
import assert from 'assert'
import status, { type Status, next as nextStatus, DefaultStatus } from './status'
import flag, { type Flag, toString as flagToString } from './flag'

export type Options = {
  flag: ?Flag,
  options: ?Object,
  addOptions: ?(Array<string>),
  spawnOptions: ?(Array<string> | string),
}

const DefaultOptions: Options = {
  flag: null,
  options: null,
  addOptions: null,
  spawnOptions: {}
}

/**
 * cmd interface
 *
 * name - cmder name, e.g. yarn or npm, the default cmder is yarn
 * installCmd - install command, usually the value was `add`
 * install - ??? wow!
 * uninstallCmd - `remove`
 * uninstall
 */
export interface cmd {
  name: string;
  installCmd: string;
  install: (string | Array<string>, ?Options) => Promise<number>;
  uninstallCmd?: string;
  uninstall?: (string | Array<string>, ?Options) => Promise<number>;
}

export default class Provider implements cmd {
  _beginAt: number;

  constructor(name: string,
              installCmd: string = 'add',
              options: Options = Options) {
    this.name = name
    this.installCmd = installCmd
    this.options = options
  }

  install(libs, options = {}) {
    /**
     * assert libs
     *
     * @TODO friendly message
     */
    let libsIsArray = Array.isArray(libs)
    if(!libs || libsIsArray && 0 === libs.length) {
      throw new Error(`require libs, but got ${libs.toString()}`)
    }

    let installOptions = []
    options = Object.assign({}, this.options, options)
    /**
     * add the cmd install process name first
     *
     * now, `yarn add`
     */
    installOptions.push(this.installCmd)

    /**
     * push libs to collects
     *
     * now, `yarn add jquery`
     */
    if(libsIsArray) {
      for(let i = 0; i < libs.length; i++) {
        installOptions.push(libs[i])
      }
    } else {
      installOptions.push(libs)
    }

    /**
     * add addons options
     *
     * now, `yarn add jquery --json`
     *
     * @TODO merge options.
     */
    let addOptions = options.addOptions
    if(addOptions) {
      if(Array.isArray(addOptions)) {
        for(let i = 0; i < addOptions.length; i++) {
          installOptions.push(addOptions[i])
        }
      } else if('string' === typeof addOptions) {
        installOptions.push(addOptions)
      } else {
        throw new Error(`options.options should be 'Array<string>' or 'string', but got ${typeof addOptions}`)
      }
    }

    /**
     * add flag
     *
     * now, `yarn add jquery --dev`
     */
    let flag = options.flag
    if(flag) {
      installOptions.push(flagToString(flag))
    }

    const cmder = 'win32' === platform() ? this.name + '.cmd' : this.name
    const spawnOptions = options.spawnOptions

    assert(this.onBegin)
    assert(this.onProcess)
    assert(this.onError)
    assert(this.onDone)

    if('development' === process.env.NODE_ENV) {
      console.log(installOptions)
    }

    return new Promise((resolve, reject) => {
      installOptions = this.onBegin(installOptions, resolve, reject)
      const installer = spawn(cmder, installOptions, spawnOptions)
      installer.stdout.on('data', data => this.onProcess(data.toString(), resolve, reject))
      installer.stderr.on('data', data => this.onError(data.toString(), resolve, reject))
      installer.on('close', code => this.onDone(code, resolve, reject))
    })
  }

  onProcess(data, resolve, reject) {}

  onError(error, resolve, reject) {}

  onBegin(installOptions, resolve, reject) {
    this._beginAt = Date.now()
    return installOptions
  }

  onDone(code, resolve, reject) {
    if(code === 0) {
      return resolve(Date.now() - this._beginAt)
    } else {
      return reject(new Error(`Install task failed.`))
    }
  }
}
