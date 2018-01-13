/**
 * parse library name to component, throw for not matched
 *
 * @flow
 */

import component from './components';

export default function parselib(libname: string): Library {
  if(!component[libname]) {
    throw new Error(`Unspported library ${libname}`);
  }

  return component[libname];
}
