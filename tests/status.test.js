import status, { next, DefaultStatus } from '../lib/status'

test('next status', () => {
  const s = DefaultStatus
  expect(next(s)).toBe(status.download)
})
