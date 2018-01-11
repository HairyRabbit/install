import cmder, { useable, checkLockFileExists } from '../lib/cmder'
import Yarn from '../lib/yarn'
import Npm from '../lib/npm'

import { sync as which } from 'which'

function isYarn(instance) {
  return instance instanceof Yarn
}

function isNpm(instance) {
  return instance instanceof Npm
}

test('find both yarn and npm', () => {
  const cmd = cmder()
  expect(isYarn(cmd)).toBe(true)
})
