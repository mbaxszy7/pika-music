exports.isDEV = process.env.NODE_ENV
exports.babelPlugins = [
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-optional-chaining",
  "@babel/plugin-proposal-nullish-coalescing-operator",
  "babel-plugin-styled-components",
  "@loadable/babel-plugin",
  [
    "@babel/plugin-syntax-decorators",
    { legacy: false, decoratorsBeforeExport: false },
  ],
]

exports.webpackResolve = {
  extensions: [".jsx", ".js", ".mjs"],
}

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


function findPara(param) {
  let result = ""
  process.argv.forEach(argv => {
    if (argv.indexOf("--" + param) === -1) return
    result = argv.split("=")[1]
  })
  return result
}

exports.getCommandArg = findPara
