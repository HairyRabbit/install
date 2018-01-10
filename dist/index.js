'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var os = require('os');
var child_process = require('child_process');
var assert = _interopDefault(require('assert'));
var readline = _interopDefault(require('readline'));

var _sPO = Object.setPrototypeOf || function _sPO(o, p) {
  o.__proto__ = p;
  return o;
};

var _construct = typeof Reflect === "object" && Reflect.construct || function _construct(Parent, args, Class) {
  var Constructor,
      a = [null];
  a.push.apply(a, args);
  Constructor = Parent.bind.apply(Parent, a);
  return _sPO(new Constructor(), Class.prototype);
};

/**
 * provider status
 *
 * 
 */
const status = {
  ready: Symbol('ready'),
  download: Symbol('download'),
  link: Symbol('link'),
  done: Symbol('done')
};
const DefaultStatus = status.ready;
function next(st) {
  switch (st) {
    case status.ready:
      return status.download;

    case status.download:
      return status.link;

    case status.link:
      return status.done;

    case status.done:
      return status.done;
  }
}

/**
 * add process flag, install packages to:
 *
 *   D - devDependencies
 *   P - peerDependencies
 *   O - optionalDependencies
 *
 * `dependencies` by default
 *
 * 
 */
function toString(flag) {
  switch (flag) {
    case flag.D:
      return '--dev';

    case flag.P:
      return '--peer';

    case flag.O:
      return '--optional';

    default:
      return '';
  }
}

/**
 * command provider
 *
 * 
 */
class Provider {
  constructor(name, installCmd = 'add', options = Options) {
    this.state = {
      status: DefaultStatus
    };
    this.name = name;
    this.installCmd = installCmd;
    this.options = options;
  }

  install(libs, options = {}) {
    /**
     * assert libs
     *
     * @TODO friendly message
     */
    let libsIsArray = Array.isArray(libs);

    if (!libs || libsIsArray && 0 === libs.length) {
      throw new Error(`require libs, but got ${libs.toString()}`);
    }

    let installOptions = [];
    options = Object.assign({}, this.options, options);
    /**
     * add the cmd install process name first
     *
     * now, `yarn add`
     */

    installOptions.push(this.installCmd);
    /**
     * push libs to collects
     *
     * now, `yarn add jquery`
     */

    if (libsIsArray) {
      for (let i = 0; i < libs.length; i++) {
        installOptions.push(libs[i]);
      }
    } else {
      installOptions.push(libs);
    }
    /**
     * add addons options
     *
     * now, `yarn add jquery --json`
     *
     * @TODO merge options.
     */


    let addOptions = options.addOptions;

    if (addOptions) {
      if (Array.isArray(addOptions)) {
        for (let i = 0; i < addOptions.length; i++) {
          installOptions.push(addOptions[i]);
        }
      } else if ('string' === typeof addOptions) {
        installOptions.push(addOptions);
      } else {
        throw new Error(`options.options should be 'Array<string>' or 'string', but got ${typeof addOptions}`);
      }
    }
    /**
     * add flag
     *
     * now, `yarn add jquery --dev`
     */


    let flag$$1 = options.flag;

    if (flag$$1) {
      installOptions.push(toString(flag$$1));
    }

    const cmder = 'win32' === os.platform() ? this.name + '.cmd' : this.name;
    const spawnOptions = options.spawnOptions;
    assert(this.onBegin);
    assert(this.onProcess);
    assert(this.onError);
    assert(this.onDone);
    return new Promise((resolve, reject) => {
      installOptions = this.onBegin(installOptions, resolve, reject);
      const installer = child_process.spawn(cmder, installOptions, spawnOptions);
      installer.stdout.on('data', data => this.onProcess(data.toString(), resolve, reject));
      installer.stderr.on('data', data => this.onError(data.toString(), resolve, reject));
      installer.on('close', code => this.onDone(code, resolve, reject));
    });
  }

}

/**
 * render a progress bar
 *
 * 
 */
class Bar {
  constructor(progress = 0, columns = process.stderr.columns || 60, char = '=', pad = ' ', stdout = process.stderr) {
    this.columns = columns;
    this._progress = progress;
    this.char = char;
    this.pad = pad;
    this.stdout = stdout;
  }
  /**
   * render a progress bar
   *
   * @TODO increment update
   */


  render() {
    const {
      _progress: progress,
      columns,
      stdout,
      char,
      pad
    } = this;
    const left = Math.floor(progress * columns);
    const right = columns - left;
    const out = char.repeat(left) + pad.repeat(right);
    stdout.write(out);
    stdout.write(' ' + (progress * 100).toFixed(2) + '%');
    return this;
  }
  /**
   * earse for rerender
   */


  earse() {
    const stdout = this.stdout;
    readline.clearLine(stdout, 0);
    readline.cursorTo(stdout, 0);
    return this;
  }

  get progress() {
    return this._progress;
  }

  set progress(val) {
    if (val > 1 || val < 0) {
      throw new Error(`The progress should between 0 and 1.`);
    } else if (this._progress !== val) {
      this._progress = val;
      this.earse().render();
    }
  }

}

/**
 * yarn provider
 *
 * 
 */
const DefaultOptions = {
  addOptions: ['--prefer-offline', '--json']
};

class Yarn extends Provider {
  constructor() {
    super('yarn', 'add', DefaultOptions);
    this.downloaded = false;
    this.max = 0;
    this.progress = 0;
    this.links = {};
    this.result = null;
    this.timer = null;
    this.working = false;
    this.timeout = 800;
    this.progressBar = new Bar(0, 40, '#', '-');
  }

  onProcess(data, resolve, reject) {
    // if(this.working) return
    // this.working = true
    // clearTimeout(this.timer)
    // this.timer = setTimeout(() => {
    //   this.working = false
    // }, this.timeout)
    const status$$1 = this.state.status;
    const datas = parse(data);
    const len = datas.length;
    if (!len) return;
    datas.forEach(data => {
      const type = data.type;
      const {
        message,
        id,
        total,
        current,
        trees
      } = data.data;

      switch (status$$1) {
        case status.ready:
          if ('step' === type && 'Fetching packages' === message) {
            this.state.status = next(status$$1);
            break;
          }

          break;

        case status.download:
          if ('progressStart' === type) {
            this.max = total;
            break;
          } else if ('progressTick' === type) {
            this.progress = current / this.max;
            break;
          } else if (type === 'step' && 'Linking dependencies' === message) {
            this.state.status = next(status$$1);
            this.downloaded = true;
            this.progress = 0;
            this.max = 0;
            break;
          }

          break;

        case status.link:
          if ('progressStart' === type && total && ~[2, 5].indexOf(id)) {
            this.links[id] = {
              progress: 0
            };
            this.max += total;
            break;
          } else if ('progressTick' === type) {
            this.links[id].progress = current;
            this.progress = this.reduceProgress();
            break;
          } else if ('success' === type) {
            this.progress = 1;
            this.state.status = next(status$$1);
            break;
          }

          break;

        case status.done:
          if ('tree' === type) {
            this.result = trees;
            break;
          }

          break;

        default:
          break;
      }
    });

    if (!this.options.quiet) {
      this.render();
    }
  }

  reduceProgress() {
    const links = this.links;
    const sum = Object.keys(links).map(key => links[key].progress).reduce((a, b) => a + b, 0);
    return sum / this.max;
  }

  onBegin(installOptions, resolve, reject) {
    this.progressBar.render();
    return installOptions;
  }

  onError(error, resolve, reject) {
    reject(new Error(error));
  }

  onDone(code, resolve, reject) {
    if (code === 0) {
      /**
       * report result
       */
      if (!this.options.quiet && this.options.report) {
        console.log(this.result);
      }
      /**
       * done and exit
       */


      return resolve();
    } else {
      /**
       * task failed
       */
      return reject(new Error(`Install task failed.`));
    }
  }

  render() {
    const {
      status: status$$1
    } = this.state;
    const {
      progress
    } = this;
    this.progressBar.progress = progress;
  }

}

function parse(input) {
  return input.split('\n').filter(s => s.trim()).map(JSON.parse);
}

var yarn = new Yarn();

/**
 * library-install
 *
 * Install a node module use yarn or npm
 *
 * @example
 *
 * ```js
 * import install from 'library-install'
 *
 * // Basic usage
 * install('react').then(output => console.log(output))
 *
 * install('react', { dev: true })
 * ```
 *
 * 
 * @jsx h
 */
// import path from 'path'
// import fs from 'fs'
// import { spawn } from 'child_process'
// import { h, render, Component, Text, Indent } from 'ink'
// import ProgressBar from 'ink-progress-bar'
// // yarn add --prefer-offline --dev @babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-decorators @babel/plugin-proposal-throw-expressions @babel/preset-env @babel/preset-flow @babel/preset-react
// // yarn add --prefer-offline --json --dev rollup rollup-plugin-node-resolve roll up-plugin-babel rollup-plugin-json rollup-plugin-commonjs
// // yarn add --prefer-offline --json --dev jest babel-jest babel-core@7.0.0-bridge.0
// export const cmder = {
//   yarn: 'yarn',
//   npm: 'npm'
// }
// export const statue = {
//   ready: 'ready',
//   done: 'done'
// }
// export const babel = Symbol()
// export const webpack = Symbol()
// export const rollup = Symbol()
// export default function installer(...args) {
//   /**
//    * validate arguments
//    */
//   const len = args.length
//   if(!len || len === 1 && !~['symbol', 'string'].indexOf(typeof args[0])) {
//     throw new Error('No arguments provide')
//   }
//   /**
//    * select libs and options, skip others
//    */
//   let libs = [], options
//   for(let i = 0; i < args.length; i++) {
//     const arg = args[i]
//     switch(typeof arg) {
//         case 'symbol':
//         case 'string':
//           libs.push(arg)
//           break
//         case 'object':
//           options = arg
//           break
//         default:
//           break
//     }
//   }
//   return create(libs, options)
//     .then(commander)
//     .then(main(libs))
//     .catch(err => {
//       throw err
//     }).catch(noop)
//     .then(log)
// }
// function main(libs) {
//   return context => {
//     context.status = statue.ready
//     return Promise.all(libs.map(lib => {
//       return exec(make(lib, context))
//         .then(data => console.log(data))
//         .catch(noop)
//     })).then(() => {
//       context.status = statue.done
//       return context
//     })
//   }
// }
// function noop() {}
// function make(lib, context) {
//   const libs = context.libs
//   const cmder = context.cmder
//   const cmdOptions = context.options
//   switch(lib) {
//       case babel:
//         return `${cmder} add --prefer-offline --dev \
// @babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-decorators @babel/plugin-proposal-throw-expressions @babel/preset-env @babel/preset-flow @babel/preset-react`
//       case webpack: {
//         const hasBabel = libs.some(lib => lib === babel)
//         return `${cmder} add --prefer-offline --dev \
// webpack@next webpack-cli \
// ${hasBabel ? 'babel-loader' : ''}`
//       }
//       default:
//         return `${cmder} add --prefer-offline ${lib}`
//   }
// }
// function selectCommander(commander) {
//   switch(commander) {
//       case cmder.yarn:
//         return 'yarn --version'
//       case cmder.npm:
//         return 'npm1 --version'
//       default:
//         return commander
//   }
// }
// /**
//  * test default commander, yarn or npm if not provide custrom commander
//  *
//  * @TODO custom commander, e.g. bower
//  */
// function commander(context) {
//   return exec(selectCommander(cmder.yarn))
//     .then(() => write({ cmder: cmder.yarn })(context))
//     .catch(() => exec(selectCommander(cmder.npm)).then(
//       () => write({ cmder: cmder.npm })(context)
//     ))
//     .catch(() => {
//       throw new Error('Commander Not Found')
//     })
// }
// function create(libs, options) {
//   const context = {}
//   context.libs = libs
//   context.options = options
//   return Promise.resolve(context)
// }
// function write(...rest) {
//   return context => {
//     const args = rest
//     args.unshift(context)
//     args.unshift({})
//     return Object.assign.apply(null, args)
//   }
// }
// function log(context) {
//   console.log(context)
//   return context
// }
// function exec(cmd, options = {}) {
//   return new Promise(function(resolve, reject) {
//     nativeExec(cmd, options, function(err, stdout, stderr) {
//       if(err || stderr) return reject(err, stderr)
//       resolve(stdout)
//     })
//   })
// }
// function exec(context) {
//   return new Promise(function(resolve, reject) {
//     const subProcess = spawn('yarn.cmd', ['add', 'jquery', '--prefer-offline', '--json', '--ignore-optional', '--ignore-platform', '--ignore-engines'])
//     const context = {
//       status: 0,
//       installProgress: 0,
//       installMax: 0,
//       links: {},
//       linkProgress: 0,
//       linkMax: 0
//     }
//     subProcess.stdout.on('data', (data) => {
//       try {
//         const datas = data.toString()
//               .split('\n')
//               .filter(s => s.trim())
//               .map(JSON.parse)
//         if(datas.length) {
//           // console.log(datas)
//           datas.forEach(data => {
//             const type = data.type
//             const json = data.data
//             if(type === 'step' && json.message === 'Fetching packages') {
//               context.status = 1
//             } else if(context.status === 1 && type ==='progressStart') {
//               context.installMax = json.total
//             } else if(context.status === 1 && type ==='progressTick') {
//               context.installProgress = json.current / context.installMax
//               console.log(context.installProgress)
//             } else if(type ==='step' && json.message === 'Linking dependencies') {
//               context.status = 2
//             } else if(context.status === 2 && type ==='progressStart') {
//               if(json.total && (json.id === 2 || json.id === 5)) {
//                 context.links[json.id] = { max: json.total, progress: 0 }
//                 context.linkMax += json.total
//               }
//             } else if(context.status === 2 && type ==='progressTick') {
//               context.links[json.id].progress = json.current
//               context.linkProgress = Object.keys(context.links)
//                 .map(key => context.links[key].progress).reduce((a, b) => a + b) / context.linkMax
//               console.log(context.linkProgress)
//             } else if(context.status === 2 && type ==='success') {
//               context.linkProgress = 1
//             } else if(type ==='tree') {
//               context.status = 3
//               context.result = json.trees
//               console.log(context.result)
//             }
//           })
//         }
//       } catch(error) {
//         throw new Error(error);
//       }
//     })
//     subProcess.stderr.on('data', (data) => {
//       //console.log(`stderr: ${data}`);
//       reject(data)
//     })
//     subProcess.on('close', (code) => {
//       console.log('closed!', code)
//       resolve(code)
//     })
//   })
// }
// class App extends Component<*, Props, State> {
//   status = {
//     init: 0,
//     install: 1,
//     link: 2,
//     done: 3,
//     fail: 4
//   };
//   /**
//    * component state
//    */
//   state: State = {
//     status: this.status.init,
//     installProgress: 0,
//     installMax: 0,
//     links: {},
//     linkProgress: 0,
//     linkMax: 0
//   };
//   /**
//    * filter the blank string
//    *
//    * @private
//    */
//   _isBlank(str: string): boolean %checks {
//     return '' !== str.trim()
//   }
//   /**
//    * parse data from stdout
//    *
//    * @private
//    */
//   _parse(input: string): Array<any> {
//     return input.split('\n').filter(this._isBlank).map(JSON.parse)
//   }
//   /**
//    * exec cmder
//    *
//    * @lifecycle
//    */
//   componentDidMount() {
//     const { libs } = this.props
//     const subProcess = spawn('yarn.cmd', [
//       'add', '--prefer-offline', '--json',
//       'jquery', 'react', 'redux', 'react-router-redux',
//       // '--ignore-optional', '--ignore-platform', '--ignore-engines'
//     ])
//     subProcess.stdout.on('data', (data) => {
//       const datas = this._parse(data.toString())
//       const len = datas.length
//       if(!len) return
//       datas.forEach(data => {
//         const type = data.type
//         const json = data.data
//         if(type === 'step' && json.message === 'Fetching packages') {
//           /**
//            * install
//            */
//           this.setState({ status: this.status.install })
//         } else if(this.state.status === 1 && type ==='progressStart') {
//           /**
//            * start process, set max
//            */
//           this.setState({ installMax: json.total })
//         } else if(this.state.status === 1 && type ==='progressTick') {
//           /**
//            * update progress
//            */
//           const progress = json.current / this.state.installMax
//           this.setState({ installProgress: progress })
//         } else if(type ==='step' && json.message === 'Linking dependencies') {
//           /**
//            * install done, start link deps.
//            */
//           this.setState({ status: this.status.link })
//         } else if(this.state.status === 2
//                   && type ==='progressStart'
//                   && json.total
//                   && ~[2, 5].indexOf(json.id)) {
//           /**
//            * compute link max
//            */
//           this.setState({
//             links: {
//               ...this.state.links,
//               [json.id]: { max: json.total, progress: 0 }
//             },
//             linkMax: this.state.linkMax += json.total
//           })
//         } else if(this.state.status === 2 && type ==='progressTick') {
//           /**
//            * update link item progress
//            */
//           this.setState({
//             links: {
//               ...this.state.links,
//               [json.id]: {
//                 ...this.state.links[json.id],
//                 progress: json.current
//               }
//             },
//             linkProgress: this._reduce()
//           })
//         } else if(this.state.status === 2 && type ==='success') {
//           /**
//            * the link task was done, update progress to 1
//            */
//           this.setState({ linkProgress: 1 })
//         } else if(type ==='tree') {
//           /**
//            * done
//            */
//           this.setState({ status: this.status.done })
//           // context.result = json.trees
//           // console.log(context.result)
//         }
//       })
//     })
//   }
//   /**
//    * reduce link progress value
//    */
//   _reduce(): number {
//     const links = this.state.links
//     const sum = Object.keys(links)
//           .map(key => links[key].progress)
//           .reduce((a, b) => a + b, 0)
//     return sum / this.state.linkMax
//   }
//   renderBar(status) {
//     switch(status) {
//     case this.status.install:
//       return this.renderProgressBar(this.state.installProgress, 'green')
//     case this.status.link:
//       return this.renderProgressBar(this.state.linkProgress, 'blue')
//     default:
//       return null
//     }
//   }
//   renderProgressBar(precent, color) {
//     const fmt = (precent * 100).toFixed(2) + '%'
//     return (
//       <span>
//         [
//         <ProgressBar percent={precent}
//                      columns={60}
//                      keyword={color}
//                      rightPad
//                      character="#" />
//         ] {fmt}
//       </span>
//     )
//   }
//   render() {
//     const { libs } = this.props
//     const {
//       status,
//       installProgress,
//       linkProgress
//     } = this.state
//     const str = libs.join(', ')
//     const right = libs.length
//     return (
//       <div>
//         <br />
//         <div>
//           <Indent size={4}>
//             {libs.map(lib => <div>{'- ' + lib}</div>)}
//           </Indent>
//         </div>
//         <div>
//           Download {this.renderBar(this.status.install)}
//         </div>
//         <div>
//           Linking  {this.renderBar(this.status.link)}
//         </div>
//       </div>
//     )
//   }
// }
// var a = render(<App libs={['jquery', 'react']} />)
console.log('Task:', 'jquery');
yarn.install('jquery', Object.assign({}, DefaultOptions, {
  addOptions: [...DefaultOptions.addOptions, '--ignore-optional']
})); //.catch(err => throw new Error(err))
//.catch(() => {})
