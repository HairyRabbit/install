/**
 * @jest
 */

import { execSync as exec } from 'child_process'
import path from 'path'
import fs from 'fs'

const current = path.resolve(__dirname)
const binPath = path.resolve(current, '../../../bin/cli.js')

function cleanDir() {
  exec('rm -rf node_modules package.json yarn.lock')
}

function readPkg() {
  return JSON.parse(
    fs.readFileSync(
      path.resolve(current, 'package.json'), 'utf-8'
    )
  )
}

test('install library', (done) => {
  process.chdir(current)
  cleanDir()
  exec(`yarn init -y`)
  let pkg
  exec(`node ${binPath} jquery`)
  pkg = readPkg()
  expect(pkg.dependencies.jquery).toBeTruthy()
  exec(`node ${binPath} babel.`)
  pkg = readPkg()
  expect(pkg.devDependencies['@babel/core']).toBeTruthy()
  exec(`node ${binPath} webpack.`)
  pkg = readPkg()
  expect(pkg.devDependencies['babel-loader']).toBeTruthy()
  cleanDir()
  done()
}, 1e6)
