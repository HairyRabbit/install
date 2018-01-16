/**
 * components
 *
 * @flow
 */

import { type Options } from '../provider';
import * as babel from 'babel';
import * as Jest from 'jest';
import * as flow from 'flow';
import * as postcss from 'postcss';
import * as sass from 'sass';
import * as webpack from 'webpack';
import * as rollup from 'rollup';
import * as lodash from 'lodash';
import * as react from 'react';
import * as redux from 'redux';
import * as router from 'router';

export type Component =
  | Array<string>
  | [Array<string>]
  | [Array<string>, Options]
  | Array<Component>;

export interface Library {
  token?: Array<string> | string;
  install(): Component;
};

export default {
  babel,
  jest: Jest,
  flow,
  postcss,
  sass,
  webpack,
  rollup,
  lodash,
  react,
  redux,
  router
};
