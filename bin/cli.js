#!/usr/bin/env node

const { default: install, parseOpts } = require('../dist')
const argv = process.argv.slice(2)
const args = parseOpts(argv)
args.push(true)

/**
 * start install process, throw when task failed.
 */
install.apply(null, args)
  .catch(error => { throw error })
  .catch(() => {})
