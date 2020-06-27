const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const isDEV = process.env.NODE_ENV === "development"

function findPara(param) {
  let result = ""
  process.argv.forEach(argv => {
    if (argv.indexOf(`--${param}`) === -1) return
    // eslint-disable-next-line prefer-destructuring
    result = argv.split("=")[1]
  })
  return result
}

const isServerBuild = findPara("build") === "server"

const setWebpackPlugins = () => {
  const plugins = []
  if (!isDEV) {
    plugins.push(new CleanWebpackPlugin())
  }
  return plugins
}

exports.isDEV = isDEV

exports.babelPlugins = [
  "babel-plugin-styled-components",
  "@babel/plugin-proposal-class-properties",
]

exports.webpackResolve = {
  extensions: [".jsx", ".js", ".mjs"],
}

exports.webpackPlugins = setWebpackPlugins()

exports.commonRules = () => {
  const rules = [
    {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name]-[hash:6].[ext]",
            publicPath: "/images",
            outputPath: "images",
            emitFile: !isServerBuild,
          },
        },
        // {
        //   loader: "image-webpack-loader",
        //   options: {
        //     // optipng.enabled: false will disable optipng
        //     optipng: {
        //       enabled: true,
        //     },
        //     pngquant: {
        //       quality: [0.65, 0.9],
        //       speed: 4,
        //     },
        //   },
        // },
      ],
    },
  ]
  return rules
}

exports.babelPresets = env => {
  const common = [
    "@babel/preset-env",
    {
      // targets: { esmodules: true },
      useBuiltIns: "usage",
      modules: false,
      debug: false,
      bugfixes: true,
      corejs: { version: 3, proposals: true },
    },
  ]
  if (env === "node") {
    common[1].targets = {
      node: "13",
    }
  } else {
    common[1].targets = {
      esmodules: true,
    }
  }
  return common
}

exports.getCommandArg = findPara
