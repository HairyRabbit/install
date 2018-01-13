/**
 * components
 *
 * @flow
 */

import { type Options } from '../provider';
import babel from 'babel';
import Jest from 'jest';
import flow from 'flow';
import postcss from 'postcss';
import sass from 'sass';
import webpack from 'webpack';
import rollup from 'rollup';
import lodash from 'lodash';
import react from 'react';
import redux from 'redux';
import router from 'router';

export type Component = [Array<string>] | [Array<string>, Options];

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
