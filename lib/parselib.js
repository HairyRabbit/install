/**
 * parse library name to component, throw for not matched
 *
 * @flow
 */

export default function parselib(libname: string, components: Object): * {
  if(!components[libname]) {
    throw new Error(`Unspported library ${libname}`);
  }

  return components[libname];
}
