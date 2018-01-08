'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var child_process = require('child_process');
var ink = require('ink');
var ProgressBar = _interopDefault(require('ink-progress-bar'));

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
// yarn add --prefer-offline --json --dev rollup rollup-plugin-node-resolve roll up-plugin-babel rollup-plugin-json rollup-plugin-commonjs
// yarn add --prefer-offline --json --dev jest babel-jest babel-core@7.0.0-bridge.0

const cmder = {
  yarn: 'yarn',
  npm: 'npm'
};
const statue = {
  ready: 'ready',
  done: 'done'
};
const babel = Symbol();
const webpack = Symbol();
const rollup = Symbol();
function installer(...args) {
  /**
   * validate arguments
   */
  const len = args.length;

  if (!len || len === 1 && !~['symbol', 'string'].indexOf(typeof args[0])) {
    throw new Error('No arguments provide');
  }
  /**
   * select libs and options, skip others
   */


  let libs = [],
      options;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (typeof arg) {
      case 'symbol':
      case 'string':
        libs.push(arg);
        break;

      case 'object':
        options = arg;
        break;

      default:
        break;
    }
  }

  return create(libs, options).then(commander).then(main(libs)).catch(err => {
    throw err;
  }).catch(noop).then(log);
}

function main(libs) {
  return context => {
    context.status = statue.ready;
    return Promise.all(libs.map(lib => {
      return exec(make(lib, context)).then(data => console.log(data)).catch(noop);
    })).then(() => {
      context.status = statue.done;
      return context;
    });
  };
}

function noop() {}

function make(lib, context) {
  const libs = context.libs;
  const cmder = context.cmder;
  const cmdOptions = context.options;

  switch (lib) {
    case babel:
      return `${cmder} add --prefer-offline --dev \
@babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-decorators @babel/plugin-proposal-throw-expressions @babel/preset-env @babel/preset-flow @babel/preset-react`;

    case webpack:
      {
        const hasBabel = libs.some(lib => lib === babel);
        return `${cmder} add --prefer-offline --dev \
webpack@next webpack-cli \
${hasBabel ? 'babel-loader' : ''}`;
      }

    default:
      return `${cmder} add --prefer-offline ${lib}`;
  }
}

function selectCommander(commander) {
  switch (commander) {
    case cmder.yarn:
      return 'yarn --version';

    case cmder.npm:
      return 'npm1 --version';

    default:
      return commander;
  }
}
/**
 * test default commander, yarn or npm if not provide custrom commander
 *
 * @TODO custom commander, e.g. bower
 */


function commander(context) {
  return exec(selectCommander(cmder.yarn)).then(() => write({
    cmder: cmder.yarn
  })(context)).catch(() => exec(selectCommander(cmder.npm)).then(() => write({
    cmder: cmder.npm
  })(context))).catch(() => {
    throw new Error('Commander Not Found');
  });
}

function create(libs, options) {
  const context = {};
  context.libs = libs;
  context.options = options;
  return Promise.resolve(context);
}

function write(...rest) {
  return context => {
    const args = rest;
    args.unshift(context);
    args.unshift({});
    return Object.assign.apply(null, args);
  };
}

function log(context) {
  console.log(context);
  return context;
}

function exec(cmd, options = {}) {
  return new Promise(function (resolve, reject) {
    nativeExec(cmd, options, function (err, stdout, stderr) {
      if (err || stderr) return reject(err, stderr);
      resolve(stdout);
    });
  });
}

function exec(context) {
  return new Promise(function (resolve, reject) {
    const subProcess = child_process.spawn('yarn.cmd', ['add', 'jquery', '--prefer-offline', '--json', '--ignore-optional', '--ignore-platform', '--ignore-engines']);
    const context = {
      status: 0,
      installProgress: 0,
      installMax: 0,
      links: {},
      linkProgress: 0,
      linkMax: 0
    };
    subProcess.stdout.on('data', data => {
      try {
        const datas = data.toString().split('\n').filter(s => s.trim()).map(JSON.parse);

        if (datas.length) {
          // console.log(datas)
          datas.forEach(data => {
            const type = data.type;
            const json = data.data;

            if (type === 'step' && json.message === 'Fetching packages') {
              context.status = 1;
            } else if (context.status === 1 && type === 'progressStart') {
              context.installMax = json.total;
            } else if (context.status === 1 && type === 'progressTick') {
              context.installProgress = json.current / context.installMax;
              console.log(context.installProgress);
            } else if (type === 'step' && json.message === 'Linking dependencies') {
              context.status = 2;
            } else if (context.status === 2 && type === 'progressStart') {
              if (json.total && (json.id === 2 || json.id === 5)) {
                context.links[json.id] = {
                  max: json.total,
                  progress: 0
                };
                context.linkMax += json.total;
              }
            } else if (context.status === 2 && type === 'progressTick') {
              context.links[json.id].progress = json.current;
              context.linkProgress = Object.keys(context.links).map(key => context.links[key].progress).reduce((a, b) => a + b) / context.linkMax;
              console.log(context.linkProgress);
            } else if (context.status === 2 && type === 'success') {
              context.linkProgress = 1;
            } else if (type === 'tree') {
              context.status = 3;
              context.result = json.trees;
              console.log(context.result);
            }
          });
        }
      } catch (error) {
        throw new Error(error);
      }
    });
    subProcess.stderr.on('data', data => {
      //console.log(`stderr: ${data}`);
      reject(data);
    });
    subProcess.on('close', code => {
      console.log('closed!', code);
      resolve(code);
    });
  });
}

class App extends ink.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), Object.defineProperty(this, "status", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        init: 0,
        install: 1,
        link: 2,
        done: 3,
        fail: 4
      }
    }), Object.defineProperty(this, "state", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        status: this.status.init,
        installProgress: 0,
        installMax: 0,
        links: {},
        linkProgress: 0,
        linkMax: 0
      }
    }), _temp;
  }

  /**
   * filter the blank string
   *
   * @private
   */
  _isBlank(str) {
    return '' !== str.trim();
  }
  /**
   * parse data from stdout
   *
   * @private
   */


  _parse(input) {
    return input.split('\n').filter(this._isBlank).map(JSON.parse);
  }
  /**
   * exec cmder
   *
   * @lifecycle
   */


  componentDidMount() {
    const {
      libs
    } = this.props;
    const subProcess = child_process.spawn('yarn.cmd', ['add', '--prefer-offline', '--json', 'jquery', 'react', 'redux', 'react-router-redux'] // '--ignore-optional', '--ignore-platform', '--ignore-engines'
    );
    subProcess.stdout.on('data', data => {
      const datas = this._parse(data.toString());

      const len = datas.length;
      if (!len) return;
      datas.forEach(data => {
        const type = data.type;
        const json = data.data;

        if (type === 'step' && json.message === 'Fetching packages') {
          /**
           * install
           */
          this.setState({
            status: this.status.install
          });
        } else if (this.state.status === 1 && type === 'progressStart') {
          /**
           * start process, set max
           */
          this.setState({
            installMax: json.total
          });
        } else if (this.state.status === 1 && type === 'progressTick') {
          /**
           * update progress
           */
          const progress = json.current / this.state.installMax;
          this.setState({
            installProgress: progress
          });
        } else if (type === 'step' && json.message === 'Linking dependencies') {
          /**
           * install done, start link deps.
           */
          this.setState({
            status: this.status.link
          });
        } else if (this.state.status === 2 && type === 'progressStart' && json.total && ~[2, 5].indexOf(json.id)) {
          /**
           * compute link max
           */
          this.setState({
            links: Object.assign({}, this.state.links, {
              [json.id]: {
                max: json.total,
                progress: 0
              }
            }),
            linkMax: this.state.linkMax += json.total
          });
        } else if (this.state.status === 2 && type === 'progressTick') {
          /**
           * update link item progress
           */
          this.setState({
            links: Object.assign({}, this.state.links, {
              [json.id]: Object.assign({}, this.state.links[json.id], {
                progress: json.current
              })
            }),
            linkProgress: this._reduce()
          });
        } else if (this.state.status === 2 && type === 'success') {
          /**
           * the link task was done, update progress to 1
           */
          this.setState({
            linkProgress: 1
          });
        } else if (type === 'tree') {
          /**
           * done
           */
          this.setState({
            status: this.status.done
          }); // context.result = json.trees
          // console.log(context.result)
        }
      });
    });
  }
  /**
   * reduce link progress value
   */


  _reduce() {
    const links = this.state.links;
    const sum = Object.keys(links).map(key => links[key].progress).reduce((a, b) => a + b);
    return sum / this.state.linkMax;
  }

  renderBar(status) {
    switch (status) {
      case this.status.install:
        return this.renderProgressBar(this.state.installProgress, 'green');

      case this.status.link:
        return this.renderProgressBar(this.state.linkProgress, 'yellow');

      default:
        return null;
    }
  }

  renderProgressBar(precent, color) {
    const fmt = (precent * 100).toFixed(2) + '%';
    return ink.h("span", null, "[", ink.h(ProgressBar, {
      percent: precent,
      columns: 60,
      keyword: color,
      rightPad: true,
      character: "#"
    }), "] ", fmt);
  }

  render() {
    const {
      libs
    } = this.props;
    const {
      status,
      installProgress,
      linkProgress
    } = this.state;
    const str = libs.join(', ');
    const right = libs.length;
    return ink.h("div", null, ink.h("br", null), ink.h("div", null, ink.h(ink.Indent, {
      size: 4
    }, libs.map(lib => ink.h("div", null, '- ' + lib)))), ink.h("div", null, "Download ", this.renderBar(this.status.install)), ink.h("div", null, "Linking  ", this.renderBar(this.status.link)));
  }

}

var a = ink.render(ink.h(App, {
  libs: ['jquery', 'react']
}));

exports.cmder = cmder;
exports.statue = statue;
exports.babel = babel;
exports.webpack = webpack;
exports.rollup = rollup;
exports['default'] = installer;
