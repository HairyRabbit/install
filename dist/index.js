'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = require('fs');
var fs__default = _interopDefault(fs);
var which = require('which');
var os = require('os');
var child_process = require('child_process');
var assert = _interopDefault(require('assert'));

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
const flag = {
  D: Symbol('D'),
  P: Symbol('P'),
  O: Symbol('O')
};
function toString(f) {
  switch (f) {
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
function reverse(f) {
  switch (f) {
    case '--dev':
    case '-D':
      return flag.D;

    case '--prod':
    case '-P':
      return flag.P;

    case '--optional':
    case '-O':
      return flag.O;

    default:
      return null;
  }
}

/**
 * command provider
 *
 * 
 */
class Provider {
  constructor(name, installCmd = 'add', options = Options) {
    this._beginAt = void 0;
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

    if ('development' === process.env.NODE_ENV) {
      console.log(installOptions);
    }

    return new Promise((resolve, reject) => {
      installOptions = this.onBegin(installOptions, resolve, reject);
      const installer = child_process.spawn(cmder, installOptions, spawnOptions);
      installer.stdout.on('data', data => this.onProcess(data.toString(), resolve, reject));
      installer.stderr.on('data', data => this.onError(data.toString(), resolve, reject));
      installer.on('close', code => this.onDone(code, resolve, reject));
    });
  }

  onProcess(data, resolve, reject) {}

  onError(error, resolve, reject) {}

  onBegin(installOptions, resolve, reject) {
    this._beginAt = Date.now();
    return installOptions;
  }

  onDone(code, resolve, reject) {
    if (code === 0) {
      return resolve(Date.now() - this._beginAt);
    } else {
      return reject(new Error(`Install task failed.`));
    }
  }

}

/**
 * yarn provider
 *
 * 
 */
const DefaultOptions = {
  addOptions: ['--prefer-offline', '--silent', '--no-progress']
};
class Yarn extends Provider {
  constructor(options = DefaultOptions) {
    super('yarn', 'add', options);
  }

}

/**
 * npm provider
 *
 * 
 */
const DefaultOptions$2 = {
  addOptions: ['--silent', '--no-progress']
};
class Npm extends Provider {
  constructor(options = DefaultOptions$2) {
    super('npm', 'install', options);
  }

}

/**
 * find cmder
 *
 * 
 */
/**
 * @testable
 */
function useable() {
  const options = {
    path: process.env.PATH || process.env.Path,
    nothrow: true
  };
  return [which.sync('yarn', options), which.sync('npm', options)];
}

function checkLockFileExists(flag) {
  const current = process.cwd();

  switch (flag) {
    case 'yarn':
      return fs.existsSync(path.resolve(current, 'yarn.lock'));

    case 'npm':
      return fs.existsSync(path.resolve(current, 'package-lock.json'));

    default:
      return false;
  }
}
function finder(options) {
  const [yarn, npm] = useable();

  if (yarn ^ npm) {
    if (!yarn) {
      throw new Error(`Can't find yarn or npm in your PATH`);
    } else {
      /**
       * now npm and yarn are all useable.
       * then check the yarn.lock or package-lock.json
       * but, why not use yarn by default ???
       */
      if (checkLockFileExists('yarn')) {
        return new Yarn(options);
      } else if (checkLockFileExists('npm')) {
        return new Npm(options);
      } else {
        /**
         * maybe a green project :)
         */
        return new Yarn(options);
      }
    }
  } else {
    if (yarn) {
      return new Yarn(options);
    } else {
      return new Npm(options);
    }
  }
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
/**
 * parser
 */

const babel = Symbol('babel'); // export const typescript = Symbol('typescript')
// export const coffee = Symbol('coffee')

const postcss = Symbol('postcss');
const sass = Symbol('sass');
/**
 * tester
 */

const jest = Symbol('jest');
/**
 * linter
 */

const flow = Symbol('flow');
/**
 * packager
 */

const webpack = Symbol('webpack');
const rollup = Symbol('webpack');
/**
 * utils
 */

const lodash = Symbol('lodash');
/**
 * frameworks
 */

const react = Symbol('react');
const redux = Symbol('redux'); // export const vue = Symbol('vue')

/**
 * framework addons
 */

const router = Symbol('router'); // export const animation = Symbol('animation')

function installer(libs, options = {}) {
  /**
   * test libs
   */
  if (!libs || Array.isArray(libs) && 0 === libs.length) {
    Promise.reject(new Error('libs was required.'));
    return;
  }

  const cmd = finder();
  const checker = isInstalled();
  const composed = compose(Array.isArray(libs) ? libs : [libs], checker, options);
  return cmd.install(composed, options);
}
/**
 * compose build-in symbols
 *
 * @TODO pluginable
 * @TODO conflict with different flag
 */

function compose(libs, checker, options) {
  const collects = [];
  const within = withlib(libs, collects, checker);
  libs.forEach(lib => {
    if ('string' === typeof lib) {
      collects.push(lib);
      return;
    } else {
      switch (lib) {
        case babel:
          {
            within(null, '@babel/core', '@babel/preset-env', '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-export-default-from', '@babel/plugin-proposal-export-namespace-from', '@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-throw-expressions');
            options.flag = flag.D;
            break;
          }

        case flow:
          within(null, 'flow-bin');
          within(babel, '@babel/present-flow');
          break;

        case jest:
          within(null, 'jest');
          within(babel, 'babel-jest', 'babel-core@7.0.0-bridge.0');
          break;

        case postcss:
          within(null, 'postcss');
          within(null, 'postcss-next');
          /**
           * @TODO postcss plugins
           */

          break;

        case sass:
          within(null, 'node-sass');
          break;

        case webpack:
          within(null, 'webpack@next', 'webpack-dev-server', 'webpack-cli', 'css-loader', 'style-loader', 'file-loader', 'url-loader', 'extract-text-webpack-plugin', 'html-webpack-plugin');
          within(babel, 'babel-loader');
          within(postcss, 'postcss-loader');
          within(sass, 'sass-loader');
          break;

        case rollup:
          within(null, 'rollup', 'rollup-plugin-uglify', 'rollup-plugin-commonjs', 'rollup-plugin-json', 'rollup-plugin-node-resolve');
          within(babel, 'rollup-plugin-babel');
          break;

        case lodash:
          within(null, 'lodash');
          within(babel, 'babel-plugin-lodash');
          break;

        case react:
          within(null, 'react', 'react-dom');
          within(babel, '@babel/preset-react');
          break;

        case redux:
          within(null, 'redux');
          within(react, 'react-redux');
          break;

        case router:
          within(react, 'react-router', 'react-router-dom', 'history');
          within(redux, 'react-router-redux');
          break;
      }
    }
  });
  return collects;
}
/**
 * check libs and already installed libs, push libname to collects
 */


function withlib(libs, collects, checker, options) {
  /**
   * find lib from packages.json, yarn lock for yarn,
   * or package-lock.json for npm
   */
  return (lib, ...deps) => {
    /**
     * the default install without any composable.
     */
    if (null === lib || ~libs.indexOf(lib) || checker(lib)) {
      deps.forEach(dep => {
        collects.push(dep);
      });
    }
  };
}

function isInstalled() {
  let installed = [];
  let pkg;

  try {
    pkg = JSON.parse(fs__default.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'));
    installed = [].concat(pkg.devDependencies && Object.keys(pkg.devDependencies) || []).concat(pkg.dependencies && Object.keys(pkg.dependencies) || []).map(parselib);
  } catch (error) {
    throw new Error(error);
  }

  return lib => {
    if (0 === installed.length) {
      /**
       * no need to check
       */
      return false;
    } else {
      return Boolean(~installed.indexOf(lib));
    }
  };
}

function parselib(lib) {
  switch (lib) {
    case '@babel/core':
      return babel;

    case 'flow':
      return flow;

    case 'jest':
      return jest;

    case 'postcss':
      return postcss;

    case 'node-sass':
      return sass;

    case 'webpack':
      return webpack;

    case 'rollup':
      return rollup;

    case 'lodash':
      return lodash;

    case 'react':
      return react;

    case 'redux':
      return redux;

    case 'react-router':
      return router;

    default:
      return lib;
  }
}

exports.babel = babel;
exports.postcss = postcss;
exports.sass = sass;
exports.jest = jest;
exports.flow = flow;
exports.webpack = webpack;
exports.rollup = rollup;
exports.lodash = lodash;
exports.react = react;
exports.redux = redux;
exports.router = router;
exports['default'] = installer;
exports.parselib = parselib;
exports.reverseflag = reverse;
