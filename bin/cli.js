#!/usr/bin/env node

const { default as install, parseopt } = require('../dist')
const argv = process.argv.slice(2)
const args = parseopt(argv)

/**
 * start install, throw error when failed.
 */
install.apply(null, args).catch(error => { throw error })
