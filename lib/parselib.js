/**
 * parse library name to component, throw for not matched
 *
 * @flow
 */

export default function parselib(libname: string, library: Object): * {
  if(!library[libname]) {
    throw new Error(`Unspported library ${libname}`);
  }

  return library[libname];
}
