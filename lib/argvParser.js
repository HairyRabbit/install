/**
 * parse argv options
 *
 * @flow
 */

import parseflag from './parseflag'
import type Options from './interfaces/options'

export const NotFoundError = new Error('Library was required.');

export default function parse(argv: Array<string>): [Array<string>, Options] {
  const len = argv.length;

  if(!len) {
    throw NotFoundError;
  } else {
    let libs = [], addOptions = [], flag = null;

    for(let i = 0; i < len; i++) {
      const arg = argv[i];
      if(~[
        '-D', '--dev', '--save-dev', '--development',
        '-O', '--optional', '--save-optional',
        '-P', '--prod', '--production', '--save', '--no-save'
      ].indexOf(arg)) {
        /**
         * set flag, override the prev flag, ensure only one flag set.
         */
        flag = parseflag(arg);
      } else if(arg.startsWith('-')) {
        /**
         * collect addOptions, pass to installer
         */
        addOptions.push(arg);
      } else {
        /**
         * set library.
         */
        libs.push(arg);
      }
    }

    if(!libs.length) {
      /**
       * throw when not provide any library
       */
      throw NotFoundError;
    } else {
      /**
       * set 'addOption' and 'flag'
       */
      return [libs, flag ? {
        addOptions,
        flag
      } : {
        addOptions
      }];
    }
  }
}
