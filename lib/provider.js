/**
 * command provider
 *
 * @flow
 */

import { platform } from 'os'
import { spawn } from 'child_process'
import assert from 'assert'
import status, { type Status, next as nextStatus } from './status'
import flag, { type Flag, toString as flagToString } from './flag'

export type Options = {
  flag: ?Flag,
  options: ?Object,
  addOptions: ?(Array<string>),
  spawnOptions: ?(Array<string> | string),
  quiet: boolean,
  report: boolean,
  progress: boolean
}

const DefaultOptions: Options = {
  flag: null,
  options: null,
  addOptions: null,
  spawnOptions: {},
  quiet: false,
  report: true,
  progress: true
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
  install: (string | Array<string>, ?Options) => Promise<void>;
  uninstallCmd?: string;
  uninstall?: (string | Array<string>, ?Options) => Promise<void>;
}

export interface installHandle<Resolve, Reject> {
  onBegin(Array<string>, Resolve, Reject): Array<string>;
  onProcess(string, Resolve, Reject): void;
  onError(string, Resolve, Rejecct): void;
  onDone(number, Resolve, Reject): void;
}

type State = {
  status: Status
}

export default class Provider implements cmd {
  constructor(name: string,
              installCmd: string = 'add',
              options: Options = Options) {
    this.name = name
    this.installCmd = installCmd
    this.options = options
  }

  state: State = {
    status: status.DefaultStatus
  };

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

    return new Promise((resolve, reject) => {
      installOptions = this.onBegin(installOptions, resolve, reject)
      console.log(installOptions)
      const installer = spawn(cmder, installOptions, spawnOptions)
      installer.stdout.on('data', data => this.onProcess(data.toString(), resolve, reject))
      installer.stderr.on('data', data => this.onError(data.toString(), reject))
      installer.on('close', code => this.onDone(code, resolve))
    })
  }
}
