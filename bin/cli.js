/**
 * installer cli
 */

const { default: install, parselib, reverseflag } = require('../dist')
const { toString } = require('../')
const argv = process.argv.slice(2)

function parse(argv) {
  const len = argv.length
  if(!len) {
    throw new Error('Requrie a library name.')
  } else {
    const libs = []
    const options = []
    const flags = []

    for(let i = 0; i < len; i++) {
      const arg = argv[i]
      if(~['-D', '--dev', '-P', '--prod', '-O', '--optional'].indexOf(arg)) {
        flags.push(reverseflag(arg))
      } else if(arg.startsWith('--')) {
        options.push(arg)
        break
      } else if(arg.endsWith('.')) {
        libs.push(parselib(arg.slice(0, -1)))
      } else {
        libs.push(arg)
      }
    }

    if(!libs.length) {
      throw new Error('Requrie a library name.')
    } else {
      return [libs, {
        addOptions: options,
        flag: flags.length && flags[flags.length - 1]
      }]
    }
  }
}


install.apply(null, parse(argv))
