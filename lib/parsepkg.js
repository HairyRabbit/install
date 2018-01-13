/**
 * parse package name to component, read from package.json
 *
 * @flow
 */

export default function parsepkg(pkgname: string,
                                 components: Array<Library>): Library {
  switch(pkgname) {
    case 'react-router':
      /**
       * @TODO: router as the special one, if both 'react-router' and
       * 'vue-router' all exists, which one should be choose?
       */
      return components.router;
    default:
      /**
       * 1. match the package name as the library name, e.g. 'flow', 'react'.
       * 2. if failed, check the plugin name matchable, e.g. the package name
       * was '@angular/core', the 'rabbit-install-angular' plugin also
       * installed and the library name was 'angular'.
       * 3. Then return input string when match failed.
       */
      return components[pkgname] &&
        components.find(finder)
        ? components[pkgname]
        : pkgname;
  }

  function finder(lib: $Keys<typeof components>): boolean %checks {
    const libcharacters = components[lib];
    if(Array.isArray(libcharacters)) {
      return Boolean(~libcharacters.indexOf(pkgname));
    } else {
      return pkgname === libcharacters;
    }
  }
}
