/**
 * @jest
 */

import { execSync as exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import install from '../../../dist'

const current = path.resolve(__dirname)

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
  Promise.resolve()
    .then(() => {
      return install('jquery')
    })
    .then(() => {
      pkg = readPkg()
      expect(pkg.dependencies.jquery).toBeTruthy()
      return
    })
    .then(() => {
      return install('babel.')
    })
    .then(() => {
      pkg = readPkg()
      expect(pkg.devDependencies['@babel/core']).toBeTruthy()
      return
    })
    .then(() => {
      return install('webpack.')
    })
    .then(() => {
      pkg = readPkg()
      expect(pkg.devDependencies['babel-loader']).toBeTruthy()
      return
    })
    .then(() => {
      cleanDir()
      done()
    })
}, 1e6)
