/**
 * command provider
 *
 * @flow
 */

import { platform } from 'os'
import { spawn } from 'child_process'
import { P, type Flag } from './flag'
import renderflag from './renderflag'
import merge from './optionsCombiner'
import type Cmd from './interfaces/cmd'
import type Options from './interfaces/options'

const DefaultOptions: Options = {
  flag: P,
  addOptions: [],
  spawnOptions: {}
}

export default class Provider implements Cmd {
  options: Options;
  name: $PropertyType<Cmd, 'name'>;
  installCmd: $PropertyType<Cmd, 'installCmd'>;
  errors: Array<string> = [];

  constructor(name: string,
              installCmd: string,
              options?: Options = DefaultOptions) {
    this.name = name
    this.installCmd = installCmd
    this.options = options
  }

  /**
   * install library by spawn subprocess, throw when not provide libs
   */
  install(libs: Array<string>, options?: Options = {}): Promise<void> {
    /**
     * ensure provide libs
     *
     * @TODO friendly message
     */
    if(!libs || Array.isArray(libs) && 0 === libs.length) {
      throw new Error(`Libs was required, but got ${libs.toString()}`)
    }

    /**
     * make options, merge the options with `DefaultOptions`
     */
    const args = this.makeOptions(libs, merge(this.options, options))

    return new Promise((resolve, reject) => {
      const installer = spawn.apply(spawn, args)
      installer.stdout.on('data', data => this.onProcess(data.toString(), resolve, reject))
      installer.stderr.on('data', data => this.onError(data.toString(), resolve, reject))
      installer.on('close', code => this.onDone(code, resolve, reject))
    })
  }

  /**
   * make subprocess options
   *
   * the syntax like:
   *
   *   CMD INSTALLCMD LIBS [...OPTIONS] FLAG
   *
   * @example
   *
   * ```js
   *   yarn add jquery --json -P
   * ```
   */
  makeOptions(libs: Array<string>, options: Options): [string, Array<string>, Object] {
    let installOptions = []

    /**
     * add the cmd install process name first
     */
    installOptions.push(this.installCmd)

    /**
     * push libs to collects
     */
    for(let i = 0; i < libs.length; i++) {
      installOptions.push(libs[i])
    }

    /**
     * add addons options
     */
    let addOptions = options.addOptions
    for(let i = 0; i < addOptions.length; i++) {
      installOptions.push(addOptions[i])
    }

    /**
     * add flag
     */
    let flag = options.flag
    installOptions.push(renderflag(flag))

    const cmder = 'win32' === process.platform ? this.name + '.cmd' : this.name
    const spawnOptions = options.spawnOptions

    return [cmder, installOptions, spawnOptions]
  }

  onProcess(data: string, resolve: Function, reject: Function): void {}

  onError(error: string, resolve: Function, reject: Function): void {
    this.errors.push(error)
  }

  onDone(code: number, resolve: Function, reject: Function): void {
    if(code === 0) {
      resolve()
    } else {
      reject(new Error(`Install task failed.`), this.errors)
    }
  }
}
