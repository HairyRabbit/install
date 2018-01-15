/**
 * library interface
 */

import type Flag from '../flag'

export type LibraryResult =
  | Array<string>
  | string

export type Result =
  | [LibraryResult, Flag]
  | LibraryResult
  | void

export interface Library {
  +id: string;
  +lib: string | Array<string>;
  install(): Result;
}
