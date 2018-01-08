'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var child_process = require('child_process');
var ink = require('ink');
var ProgressBar = _interopDefault(require('ink-progress-bar'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

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

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

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

var cmder = {
  yarn: 'yarn',
  npm: 'npm'
};
var statue = {
  ready: 'ready',
  done: 'done'
};
var babel = Symbol();
var webpack = Symbol();
var rollup = Symbol();
function installer() {
  /**
   * validate arguments
   */
  var len = arguments.length;

  if (!len || len === 1 && !~['symbol', 'string'].indexOf(typeof (arguments.length <= 0 ? undefined : arguments[0]))) {
    throw new Error('No arguments provide');
  }
  /**
   * select libs and options, skip others
   */


  var libs = [],
      options;

  for (var i = 0; i < arguments.length; i++) {
    var arg = i < 0 || arguments.length <= i ? undefined : arguments[i];

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

  return create(libs, options).then(commander).then(main(libs)).catch(function (err) {
    throw err;
  }).catch(noop).then(log);
}

function main(libs) {
  return function (context) {
    context.status = statue.ready;
    return Promise.all(libs.map(function (lib) {
      return exec(make(lib, context)).then(function (data) {
        return console.log(data);
      }).catch(noop);
    })).then(function () {
      context.status = statue.done;
      return context;
    });
  };
}

function noop() {}

function make(lib, context) {
  var libs = context.libs;
  var cmder = context.cmder;
  var cmdOptions = context.options;

  switch (lib) {
    case babel:
      return cmder + " add --prefer-offline --dev @babel/core @babel/plugin-proposal-class-properties @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-decorators @babel/plugin-proposal-throw-expressions @babel/preset-env @babel/preset-flow @babel/preset-react";

    case webpack:
      {
        var hasBabel = libs.some(function (lib) {
          return lib === babel;
        });
        return cmder + " add --prefer-offline --dev webpack@next webpack-cli " + (hasBabel ? 'babel-loader' : '');
      }

    default:
      return cmder + " add --prefer-offline " + lib;
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
  return exec(selectCommander(cmder.yarn)).then(function () {
    return write({
      cmder: cmder.yarn
    })(context);
  }).catch(function () {
    return exec(selectCommander(cmder.npm)).then(function () {
      return write({
        cmder: cmder.npm
      })(context);
    });
  }).catch(function () {
    throw new Error('Commander Not Found');
  });
}

function create(libs, options) {
  var context = {};
  context.libs = libs;
  context.options = options;
  return Promise.resolve(context);
}

function write() {
  for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
    rest[_key] = arguments[_key];
  }

  return function (context) {
    var args = rest;
    args.unshift(context);
    args.unshift({});
    return Object.assign.apply(null, args);
  };
}

function log(context) {
  console.log(context);
  return context;
}

function exec(cmd, options) {
  if (options === void 0) {
    options = {};
  }

  return new Promise(function (resolve, reject) {
    nativeExec(cmd, options, function (err, stdout, stderr) {
      if (err || stderr) return reject(err, stderr);
      resolve(stdout);
    });
  });
}

function exec(context) {
  return new Promise(function (resolve, reject) {
    var subProcess = child_process.spawn('yarn.cmd', ['add', 'jquery', '--prefer-offline', '--json', '--ignore-optional', '--ignore-platform', '--ignore-engines']);
    var context = {
      status: 0,
      installProgress: 0,
      installMax: 0,
      links: {},
      linkProgress: 0,
      linkMax: 0
    };
    subProcess.stdout.on('data', function (data) {
      try {
        var datas = data.toString().split('\n').filter(function (s) {
          return s.trim();
        }).map(JSON.parse);

        if (datas.length) {
          // console.log(datas)
          datas.forEach(function (data) {
            var type = data.type;
            var json = data.data;

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
              context.linkProgress = Object.keys(context.links).map(function (key) {
                return context.links[key].progress;
              }).reduce(function (a, b) {
                return a + b;
              }) / context.linkMax;
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
    subProcess.stderr.on('data', function (data) {
      //console.log(`stderr: ${data}`);
      reject(data);
    });
    subProcess.on('close', function (code) {
      console.log('closed!', code);
      resolve(code);
    });
  });
}

var App =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(App, _Component);

  function App() {
    var _temp, _this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return (_temp = _this = _Component.call.apply(_Component, [this].concat(args)) || this, Object.defineProperty(_assertThisInitialized(_this), "state", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        status: status.init,
        installProgress: 0,
        installMax: 0,
        links: {},
        linkProgress: 0,
        linkMax: 0
      }
    }), Object.defineProperty(_assertThisInitialized(_this), "status", {
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
    }), _temp) || _assertThisInitialized(_this);
  }

  var _proto = App.prototype;

  /**
   * filter the blank string
   *
   * @private
   */
  _proto._isBlank = function _isBlank(str) {
    return '' === str.trim();
  };
  /**
   * parse data from stdout
   *
   * @private
   */


  _proto._parser = function _parser(input) {
    return parser.split('\n').filter(this._isBlank).map(JSON.parse);
  };
  /**
   * exec cmder
   *
   * @lifecycle
   */


  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var libs = this.props.context.libs;
    var subProcess = child_process.spawn('yarn.cmd', ['add', 'jquery', '--prefer-offline', '--json', '--ignore-optional', '--ignore-platform', '--ignore-engines']);
    subProcess.stdout.on('data', function (data) {
      var datas = _this2._parser(data.toString());

      var len = datas.length;
      if (!len) return;
      datas.forEach(function (data) {
        var type = data.type;
        var json = data.data;

        if (type === 'step' && json.message === 'Fetching packages') {
          /**
           * install
           */
          _this2.setState({
            status: _this2.status.install
          });
        } else if (context.status === 1 && type === 'progressStart') {
          /**
           * start process, set max
           */
          _this2.setState({
            installMax: json.total
          });
        } else if (context.status === 1 && type === 'progressTick') {
          /**
           * update progress
           */
          var progress = json.current / _this2.state.installMax;

          _this2.setState({
            installProgress: progress
          });
        } else if (type === 'step' && json.message === 'Linking dependencies') {
          /**
           * install done, start link deps.
           */
          _this2.setState({
            status: _this2.status.link
          });
        } else if (context.status === 2 && type === 'progressStart' && json.total && ~[2, 5].indexOf(json.id)) {
          var _Object$assign;

          /**
           * compute link max
           */
          _this2.setState({
            links: Object.assign({}, _this2.state.links, (_Object$assign = {}, _Object$assign[json.id] = {
              max: json.total,
              progress: 0
            }, _Object$assign)),
            linkMax: _this2.state.linkMax += json.total
          });
        } else if (context.status === 2 && type === 'progressTick') {
          var _Object$assign2;

          /**
           * update link item progress
           */
          _this2.setState({
            links: Object.assign({}, _this2.state.links, (_Object$assign2 = {}, _Object$assign2[json.id] = Object.assign({}, _this2.state.links[json.id], {
              progess: json.current
            }), _Object$assign2)),
            linkPorgress: _this2._reduce()
          }); // console.log(context.linkProgress)

        } else if (context.status === 2 && type === 'success') {
          /**
           * the link task was done, update progress to 1
           */
          _this2.setState({
            linkProgress: 1
          });
        } else if (type === 'tree') {
          /**
           * done
           */
          _this2.setState({
            status: status.done
          }); // context.result = json.trees
          // console.log(context.result)

        }
      });
    });
  };
  /**
   * reduce link progress value
   */


  _proto._reduce = function _reduce() {
    var links = this.state.links;
    var sum = Object.keys(links).map(function (key) {
      return links[key].progress;
    }).reduce(function (a, b) {
      return a + b;
    });
    return sum / this.state.linkMax;
  };

  _proto.renderBar = function renderBar() {
    switch (this.state.status) {
      case status.install:
        return renderProgressBar(this.state.installProgress, 'green');

      case status.link:
        return renderProgressBar(this.state.linkProgress, 'blue');

      default:
        return null;
    }
  };

  _proto.renderProgressBar = function renderProgressBar(precent, color) {
    return ink.h("div", null, "[", ink.h(ProgressBar, {
      percent: precent,
      columns: 10,
      color: color,
      character: "="
    }), "]");
  };

  _proto.render = function render$$1() {
    var libs = this.props.libs;
    var _state = this.state,
        status = _state.status,
        installProgress = _state.installProgress,
        linkProgress = _state.linkProgress;
    var str = libs.join(',');
    var right = libs.length;
    return ink.h("div", null, this.renderBar(), ink.h(ink.Text, {
      color: color
    }, " ", str));
  };

  return App;
}(ink.Component);

ink.render(ink.h(App, {
  libs: ['jquery'],
  progress: 0.5,
  green: true
}));

exports.cmder = cmder;
exports.statue = statue;
exports.babel = babel;
exports.webpack = webpack;
exports.rollup = rollup;
exports['default'] = installer;
