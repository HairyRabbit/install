/**
 * yarn provider
 *
 * @flow
 */

import Provider, { type installHandle } from './provider'
import lifeStatus, { next as nextStatus } from './status'
import ProgressBar from './bar'

export const DefaultOptions = {
  addOptions: [
    '--prefer-offline',
    '--json'
  ]
}

type Timer = number

class Yarn extends Provider implements installHandle {
  constructor() {
    super('yarn', 'add', DefaultOptions)

    this.progressBar = new ProgressBar(0, 40, '#', '-')
  }

  downloaded: boolean = false;
  max: number = 0;
  progress: number = 0;
  links: { [id: number]: { progress: number } } = {};
  result: any = null;
  timer: Timer = null;
  working: boolean = false;
  timeout: number = 800

  onProcess(data, resolve, reject) {
    // if(this.working) return
    // this.working = true
    // clearTimeout(this.timer)
    // this.timer = setTimeout(() => {
    //   this.working = false
    // }, this.timeout)

    const status = this.state.status
    const datas = parse(data)
    const len = datas.length

    if(!len) return

    datas.forEach(data => {
      const type = data.type
      const { message, id, total, current, trees } = data.data
      switch(status) {
        case lifeStatus.ready:
          if('step' === type && 'Fetching packages' === message) {
            this.state.status = nextStatus(status)
            break
          }

          break

        case lifeStatus.download:
          if('progressStart' === type) {
            this.max = total
            break
          } else if('progressTick' === type) {
            this.progress = current / this.max
            break
          } else if(type ==='step' && 'Linking dependencies' === message) {
            this.state.status = nextStatus(status)
            this.downloaded = true
            this.progress = 0
            this.max = 0
            break
          }

          break

        case lifeStatus.link:
          if('progressStart' === type && total && ~[2, 5].indexOf(id)) {
            this.links[id] = { progress: 0 }
            this.max += total
            break
          } else if('progressTick' === type) {
            this.links[id].progress = current
            this.progress = this.reduceProgress()
            break
          } else if('success' === type) {
            this.progress = 1
            this.state.status = nextStatus(status)
            break
          }

          break

        case lifeStatus.done:
          if('tree' === type) {
            this.result = trees
            break
          }

          break

        default:
          break
      }
    })

    if(!this.options.quiet) {
      this.render()
    }
  }

  reduceProgress(): number {
    const links = this.links
    const sum = Object.keys(links)
          .map(key => links[key].progress)
          .reduce((a, b) => a + b, 0)
    return sum / this.max
  }

  onBegin(installOptions, resolve, reject) {
    this.progressBar.render()
    return installOptions
  }

  onError(error, resolve, reject) {
    reject(new Error(error))
  }

  onDone(code, resolve, reject) {
    if(code === 0) {
      /**
       * report result
       */
      if(!this.options.quiet && this.options.report) {
        console.log(this.result)
      }

      /**
       * done and exit
       */
      return resolve()
    } else {
      /**
       * task failed
       */
      return reject(new Error(`Install task failed.`))
    }
  }

  render() {
    const { status } = this.state
    const { progress } = this
    this.progressBar.progress = progress
  }
}

type YarnProcess = {
  type: string,
  data: Object
}

function parse(input: string): Array<YarnProcess> {
  return input.split('\n').filter(s => s.trim()).map(JSON.parse)
}

export default new Yarn()
