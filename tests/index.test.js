import fs from 'fs'
import path from 'path'
import buildin from '../lib/symbols'
import install, { dispose } from '../lib'

const current = path.resolve(__dirname)
const pkgpath = path.resolve(current, 'package.json')

jest.mock('child_process')

function readpkg() {
  return JSON.parse(fs.readFileSync(pkgpath, 'utf-8'))
}

function writepkg(cb) {
  const pkg = readpkg()
  console.log(pkg)
  cb(pkg)
  fs.writeFileSync(
    pkgpath,
    JSON.stringify(pkg, false, '\t'),
    'utf-8'
  )
}

function clearpkg() {
  const pkg = readpkg()
  pkg.dependencies = {}
  pkg.devDependencies = {}
  pkg.peerDependencies = {}
  fs.writeFileSync(
    pkgpath,
    JSON.stringify(pkg, false, '\t'),
    'utf-8'
  )
}

beforeEach(() => {
  process.chdir(current)
  clearpkg()
})

// test('install component', () => {
//   return expect(install(buildin.babel, { cwd: __dirname })).resolves.toBeTruthy()
// }, 1e6)

// test('install component and run hooks', (done) => {
//   Promise.resolve()
//     .then(() => install(buildin.babel, { cwd: current }))
//     .then(() => writepkg(pkg => pkg.devDependencies['@babel/core'] = '42'))
//     .then(() => install(buildin.webpack, { cwd: current }))
//     .then(() => {
//       expect(readpkg().devDependencies['babel-loader']).toBeTruthy()
//     })
//     .then(done)
// }, 1e6)

// test('install component and run hooks by others', (done) => {
//   Promise.resolve()
//     .then(() => install(buildin.webpack, { cwd: current }))
//     .then(() => writepkg(pkg => pkg.devDependencies['webpack'] = '42'))
//     .then(() => install(buildin.babel, { cwd: current }))
//     .then(() => {
//       expect(readpkg().devDependencies['babel-loader']).toBeTruthy()
//     })
//     .then(done)
// }, 1e6)

// test('install multi component', (done) => {
//   Promise.resolve()
//     .then(() => install([buildin.babel, buildin.webpack], { cwd: current }))
//     .then(() => {
//       expect(readpkg().devDependencies['babel-loader']).toBeTruthy()
//     })
//     .then(done)
// }, 1e6)

// test('install multi component', (done) => {
//   Promise.resolve()
//     .then(() => install([buildin.babel, buildin.webpack], { cwd: current }))
//     .then(() => writepkg(pkg => {
//       pkg.devDependencies['webpack'] = '42'
//       pkg.devDependencies['@babel/core'] = '42'
//     }))
//     .then(() => install([buildin.flow, buildin.jest], { cwd: current }))
//     .then(() => {
//       expect(readpkg().devDependencies['babel-loader']).toBeTruthy()
//     })
//     .then(done)
// }, 1e6)

test('install framework components', (done) => {
  Promise.resolve()
    .then(() => install([buildin.redux, buildin.router], { cwd: current }))
    .then(() => writepkg(pkg => {
      // pkg.devDependencies['react'] = '42'
    }))
    .then(() => install([buildin.babel, buildin.flow, buildin.jest], { cwd: current }))
    .then(() => {
      expect(readpkg().devDependencies['babel-loader']).toBeTruthy()
    })
    .then(done)
}, 1e6)
