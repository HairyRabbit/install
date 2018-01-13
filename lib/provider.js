/**
 * command provider
 *
 * @flow
 */

import { platform } from 'os'
import { spawn } from 'child_process'
import assert from 'assert'
import flag, { type Flag, toString as flagToString } from './flag'

export type Options = {
  flag?: Flag,
  addOptions?: Array<string>,
  spawnOptions?: Object,
  cwd?: string
}

const DefaultOptions: Options = {
  flag: flag._,
  addOptions: [],
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
export interface Cmd {
  name: string;
  installCmd: string;
  install(Array<string>, Options): Promise<number>;
  uninstallCmd?: string;
  uninstall?: (string | Array<string>, options?: ?Options) => Promise<number>;
}

export default class Provider implements Cmd {
  _beginAt: number;
  options: Options;
  name: $PropertyType<Cmd, 'name'>;
  installCmd: $PropertyType<Cmd, 'installCmd'>;
  constructor(name: string,
              installCmd: string,
              options?: Options = DefaultOptions) {
    this.name = name
    this.installCmd = installCmd
    this.options = options
  }

  install(libs: Array<string>, options?: Options = {}): Promise<number> {
    /**
     * assert libs
     *
     * @TODO friendly message
     */
    if(Array.isArray(libs) && 0 === libs.length) {
      throw new Error(`require libs, but got ${libs.toString()}`)
    }

    let installOptions = []
    /**
     * merge options
     */
    console.log(this.options, options)
    options = merge(this.options, options)

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
    for(let i = 0; i < libs.length; i++) {
      installOptions.push(libs[i])
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
        throw new Error(`options.addOptions should be 'Array<string>' or 'string', but got ${typeof addOptions}`)
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

    console.log(cmder, installOptions)

    return new Promise((resolve, reject) => {
      installOptions = this.onBegin(installOptions, resolve, reject)
      const installer = spawn(cmder, installOptions, spawnOptions)
      installer.stdout.on('data', data => this.onProcess(data.toString(), resolve, reject))
      installer.stderr.on('data', data => this.onError(data.toString(), resolve, reject))
      installer.on('close', code => this.onDone(code, resolve, reject))
    })
  }

  onProcess(data: string, resolve: Function, reject: Function): void {}

  onError(error: string, resolve: Function, reject: Function): void {
    console.log(error)
  }

  onBegin<T>(installOptions: T,
          resolve: Function,
          reject: Function): T {
    this._beginAt = Date.now()
    return installOptions
  }

  onDone(code: number, resolve: Function, reject: Function): void {
    if(code === 0) {
      resolve(Date.now() - this._beginAt)
    } else {
      reject(new Error(`Install task failed.`))
    }
  }
}


export function merge(opt1: Options, opt2: Options): Options {
  return {
    flag: opt2.flag || opt1.flag,
    addOptions: [].concat(opt1.addOptions || []).concat(opt2.addOptions || []),
    spawnOptions: Object.assign({}, opt1.spawnOptions, opt2.spawnOptions),
  }
}
