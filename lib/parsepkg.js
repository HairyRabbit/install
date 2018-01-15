/**
 * parse package name to component, read from package.json
 *
 * @flow
 */

export default function parsepkg(pkgname: string, components: Object): * {
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
      const component = components[pkgname];
      if(component) {
        return component;
      } else {
        const lib = Object.keys(components).find(finder);
        return lib ? components[lib] : pkgname;
      }
  }

  function finder(lib: $Keys<typeof components>): boolean %checks {
    const token = components[lib].token;
    if(Array.isArray(token)) {
      return Boolean(~token.indexOf(pkgname));
    } else {
      return pkgname === token;
    }
  }
}
