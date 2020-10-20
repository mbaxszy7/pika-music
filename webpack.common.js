const path = require("path")
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
exports.webpackSplitChunks = {
  chunks: "all",
  // minSize: 30000,
  // maxSize: 0,
  minChunks: 1,
  maxAsyncRequests: 6,
  maxInitialRequests: 4,
  automaticNameDelimiter: "-",
  // automaticNameMaxLength: 30,
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: 2,
      chunks: "all",
      name: "vendors",
    },
    default: {
      name: "commmon",
      minChunks: 2,
      priority: 1,
      reuseExistingChunk: true,
    },
  },
}
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
      node: "14",
    }
  } else if (env === "legacy") {
    common[1].targets = {
      ios: "9",
      safari: "9",
    }
    common[1].bugfixes = false
  } else {
    common[1].targets = {
      esmodules: true,
    }
  }
  return common
}

exports.getCommandArg = findPara
