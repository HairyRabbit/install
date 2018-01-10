/**
 * provider status
 *
 * @flow
 */

const status = {
  ready: Symbol('ready'),
  download: Symbol('download'),
  link: Symbol('link'),
  done: Symbol('done')
}

export type Status = $Values<status>

export const DefaultStatus = status.ready

export function next(st) {
  switch(st) {
    case status.ready:
      return status.download
    case status.download:
      return status.link
    case status.link:
      return status.done
    case status.done:
      return status.done
  }
}

export default status
