# @rabbitcc/install

A tool for install library.

## The Story

Think about if you want to create a new frontend project and use babel.

```sh
mkdir project
cd project
yarn init -y
yarn add --dev
@babel/core @babel/preset-env
@babel/plugin-proposal-class-properties
@babel/plugin-proposal-export-default-from
@babel/plugin-proposal-export-namespace-from
@babel/plugin-syntax-dynamic-import
@babel/plugin-proposal-throw-expressions
```

Ooops, too many plugins need to install.

Then, we maybe need use webpack to bundle our project. So we need install `webpack` and its plugins:

```sh
yarn add --dev
webpack webpack-dev webpack-cli
css-loader style-loader extract-text-webpack-plugin
file-loader url-loader
html-webpack-plugin html-webpack-template
uglifyjs-webpack-plugin
```

Hummm, Somthing lost? Yeap, the `babel-loader`.

```sh
yarn add babel-loader
```


## The Solution

Just type below command that **ends with dot**:

```sh
rabi babel.
```

also with the webpack

```sh
rabi webpack.
```

`rabi` will install `babel-loader` by default.


sort by:

```sh
rabi babel. webpack.

```

If think about the dependencies. We can find many library can be composed, like:

```sh
// buildtools
babel + flow = @babel/presets-flow
babel + jest = [babel-jest, babel-core@7.0.0-bridge.0]
babel + rollup = rollup-plugin-babel

// frameworks
react + redux = react-redux
react + router = [react-router, react-router-dom]
redux + router = [react-router-redux]
```

Please see the build-in [libaraies](/lib/library).


## Contribute

Any idea plase send me [issue](https://github.com/HairyRabbit/library-install/issues/new)
