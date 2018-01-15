# @rabbitcc/install

A tool for install library.

## The store

Think about if you want to create a new frontend project and use babel.

```sh
mkdir project
cd project
yarn init -y
yarn add @babel/core @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-proposal-export-default-from @babel/plugin-proposal-export-namespace-from @babel/plugin-proposal-export-namespace-from @babel/plugin-syntax-dynamic-import @babel/plugin-proposal-throw-expressions
```

so many plugins need to install, if use this tool:

```sh
rabi babel.
```

and then. we also need webpack to bundle our project. We need install `webpack` and its plugins too:

```sh
yarn add webpack webpack-dev webpack-cli css-loader style-loader file-loader url-loader extract-text-webpack-plugin html-webpack-plugin html-webpack-template uglifyjs-webpack-plugin
```

lost somthing? Yes, the `babel-loader`.

```sh
yarn add babel-loader
```

so, this tool let make it easy:

```sh
rabi webpack.
```

And... Many libraries can be compose, like:

```sh
react + redux = react-redux
react + router = [react-router, react-router-dom]
redux + router = [react-router-redux]

babel + flow = @babel/presets-flow
babel + jest = [babel-jest, babel-core@7.0.0-bridge.0]
babel + rollup = rollup-plugin-babel
```


## Usage
