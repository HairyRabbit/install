/**
 * parse package name to component, read from package.json
 *
 * @flow
 */

import type { Library, LibraryMap } from './interfaces/library'

export default function parsepkg(library: LibraryMap = {}): * {
  return (pkgname: string): Library | string => {
    switch(pkgname) {
      case 'react-router':
        /**
         * @TODO: router as the special one, if both 'react-router' and
         * 'vue-router' all exists, which one should be choose?
         */
        return library.router
      default:
        /**
         * 1. match the package name as the library name, e.g. 'flow', 'react'.
         * 2. if failed, check the plugin token, e.g. the installed module name
         * was '@angular/core', if the 'rabbit-install-angular' plugin also
         * installed so the library id was 'angular'. need reverse '@angular/core'
         * to 'angular'
         * 3. return input string when match failed.
         */
        const component = library[pkgname]
        if(component) {
          return component
        } else {
          const lib = Object.keys(library).find(finder)
          return lib ? library[lib] : pkgname
        }
    }

    function finder(lib: $Keys<typeof library>): boolean {
      const token = new library[lib]().lib;
      if(Array.isArray(token)) {
        return Boolean(~token.indexOf(pkgname))
      } else {
        return pkgname === token
      }
    }
  }
}
