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

const isServerBuild = findPara("build") === "server"

const setWebpackPlugins = () => {
  const plugins = []
  if (findPara("render") === "server") {
    plugins.push(new CleanWebpackPlugin())
  }
  return plugins
}

exports.isDEV = process.env.NODE_ENV

exports.babelPlugins = [
  "babel-plugin-styled-components",
  "@babel/plugin-proposal-class-properties",
  "react-loadable/babel",
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
        {
          loader: "image-webpack-loader",
          options: {
            mozjpeg: {
              progressive: true,
              quality: 65,
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: true,
            },
            pngquant: {
              quality: [0.65, 0.9],
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
          },
        },
      ],
    },
  ]
  return rules
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

exports.getCommandArg = findPara
