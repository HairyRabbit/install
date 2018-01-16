/**
 * parse library name to component, throw for not matched
 *
 * @flow
 */

import type { Library, LibraryMap } from './interfaces/library'


export default function parselib(library: LibraryMap = {}) {
  return (libname: string): Library | string => {
    if(libname.endsWith('.')) {
      const name = libname.slice(0, -1)
      const lib = library[name]

      /**
       * can't match buildin library and installed plugins
       */
      if(!lib) {
        throw new Error(`Unspported library ${name}. \
Maybe forget to install @rabbitcc/install-library-${name}? Please install and \
try again:

  rabi -D @rabbitcc/install-library-${name}
Or
  npm install --save-dev @rabbitcc/install-library-${name}
Or
  yarn add --dev @rabbitcc/install-library-${name}

If can't find any modules, please commit feture request on:

  https://github.com/HairyRabbit/library-install/issues/new

Happy Hacking`);
      } else {
        return lib
      }
    }

    return libname;
  }
}
