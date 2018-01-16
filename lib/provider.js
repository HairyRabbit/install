/**
 * command provider
 *
 * @flow
 */

import { spawn } from 'child_process'
import { P, type Flag } from './flag'
import render from './flagGenerator'
import merge from './optionsCombiner'
import type { Cmd } from './interfaces/cmd'
import type { Options } from './interfaces/options'

const DefaultOptions: Options = {
  flag: P,
  addOptions: [],
  spawnOptions: {},
  log: false
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
    this.options = merge(this.options, options)
    const args = this.makeOptions(libs, this.options)
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
    let addOptions = options.addOptions || []
    for(let i = 0; i < addOptions.length; i++) {
      installOptions.push(addOptions[i])
    }

    /**
     * add flag
     */
    let flag = options.flag || P
    installOptions.push(render(flag))

    /**
     * keep slient
     */
    if(!options.log) {
      installOptions.push('--silent'),
      installOptions.push('--no-progress')
    }

    installOptions = [...new Set(installOptions.filter(x => Boolean(x)))]

    const spawnOptions = options.spawnOptions || {}
    return [this.name, installOptions, spawnOptions]
  }

  onProcess(data: string, resolve: Function, reject: Function): void {
    if(this.options.log) {
      console.log(data)
    }
  }

  onError(error: string, resolve: Function, reject: Function): void {
    if(this.options.log) {
      console.log(error)
    }
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
