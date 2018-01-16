#!/usr/bin/env node

const { default: install, parseOpts } = require('../dist')
const argv = process.argv.slice(2)
const args = parseOpts(argv)

/**
 * start install process, throw when task failed.
 */
args.push(true)

install.apply(null, args)
  .catch(error => { throw error })
  .catch(() => {})
