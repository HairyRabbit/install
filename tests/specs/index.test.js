import install from '../lib'

jest.mock('../lib/cmder', () => {
  return () => {
    return {
      install(libs, options) {
        return Promise.resolve({ libs, options })
      }
    }
  }
})

test('install normal module', () => {
  return expect(install(['jquery'])).resolves.toEqual({
    libs: ['jquery'],
    options: {}
  })
})

test('install library', () => {
  return expect(install(['babel.'])).resolves.toEqual({
    libs: ['babel.'],
    options: {

    }
  })
})

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

// test('install framework components', (done) => {
//   Promise.resolve()
//     .then(() => install(['babel.', 'webpack.']))
//     .then(() => writepkg(pkg => {
//       // pkg.devDependencies['react'] = '42'
//     }))
//     .then(() => install([buildin.babel, buildin.flow, buildin.jest], { cwd: current }))
//     .then(() => {
//       expect(readpkg().devDependencies['babel-loader']).toBeTruthy()
//     })
//     .then(done)
// }, 1e6)
