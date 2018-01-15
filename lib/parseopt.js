/**
 * parse argv options
 *
 * @flow
 */

import parselib from './parselib';
import parseflag from './parseflag';

export const NotFoundError = new Error('Library was required.');

export default function parse(argv: Array<string>): [Library, Options] {
  const len = argv.length;

  if(!len) {
    throw NotFoundError;
  } else {
    let libs = [], addOptions = [], flag = parseflag();

    for(let i = 0; i < len; i++) {
      const arg = argv[i];
      if(~['-D', '--dev', '-P', '--prod', '-O', '--optional'].indexOf(arg)) {
        /**
         * parse flag, override the prev flag, ensure only one flag set.
         */
        flag = parseflag(arg);
      } else if(arg.startsWith('-')) {
        /**
         * collect addOptions, pass to installer
         */
        addOptions.push(arg);
        break;
      } else if(arg.endsWith('.')) {
        /**
         * buildin librarys
         */
        libs.push(parselib(arg.slice(0, -1)));
      } else {
        /**
         * normal library.
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
      return [libs, {
        addOptions,
        flag
      }];
    }
  }
}