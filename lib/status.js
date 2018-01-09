/**
 * provider status
 *
 * @flow
 */

const status = {
  ready: Symbol(),
  download: Symbol(),
  link: Symbol(),
  done: Symbol()
}

export type Status = $Values<status>

export const DefaultStatus = status.ready

export function next(st) {
  switch(st) {
    case st.ready:
      return status.download
    case st.download:
      return status.link
    case st.link:
      return status.done
    case st.done:
      return status.done
  }
}

export default status
