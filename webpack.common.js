const { CleanWebpackPlugin } = require("clean-webpack-plugin")

function findPara(param) {
  let result = ""
  process.argv.forEach(argv => {
    if (argv.indexOf(`--${param}`) === -1) return
    // eslint-disable-next-line prefer-destructuring
    result = argv.split("=")[1]
  })
  return result
}

exports.isDEV = process.env.NODE_ENV
exports.babelPlugins = [
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-optional-chaining",
  "@babel/plugin-proposal-nullish-coalescing-operator",
  "babel-plugin-styled-components",
  [
    "@babel/plugin-syntax-decorators",
    { legacy: false, decoratorsBeforeExport: false },
  ],
  "react-loadable/babel",
]

exports.webpackResolve = {
  extensions: [".jsx", ".js", ".mjs"],
}

exports.webpackPlugins = [findPara("render") && new CleanWebpackPlugin()]

exports.babelPresets = env => {
  const common = [
    "@babel/preset-env",
    {
      useBuiltIns: "usage",
      modules: false,
      debug: true,
      corejs: { version: 3, proposals: true },
    },
  ]
  if (env === "node") {
    common[1].targets = {
      node: "12",
    }
  }
  return common
}

exports.getCommandArg = findPara
