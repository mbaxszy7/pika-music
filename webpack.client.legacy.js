const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")
const ModuleHtmlPlugin = require("./module-html-plugin")
const {
  isDEV,
  babelPresets,
  babelPlugins,
  webpackResolve,
  getCommandArg,
  commonRules,
  webpackSplitChunks,
} = require("./webpack.common.js")
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin

const settedBabelPlugins = !isDEV
  ? [
      ...babelPlugins,
      ["transform-remove-console", { exclude: ["error", "warn"] }],
    ]
  : [...babelPlugins, "react-hot-loader/babel"]

const webpackAlias = isDEV
  ? {
      "react-dom": "@hot-loader/react-dom",
    }
  : {}

module.exports = {
  target: ["web", "es5"],
  entry: {
    client: path.resolve(__dirname, "./src/client/index.js"),
  },
  output: {
    publicPath: isDEV ? "/" : "/public/",
    // filename: `application-[${isDEV ? "chunkhash" : "contenthash"}].js`,
    filename: isDEV
      ? "[name]-[hash]-legacy.js"
      : `[name]-[contenthash]-legacy.js`,
    chunkFilename: isDEV
      ? "[name]-[hash]-legacy.js"
      : `[name]-[contenthash]-legacy.js`,
    path: path.resolve(__dirname, "public"),
  },
  devtool: isDEV ? "cheap-module-eval-source-map" : "nosources-source-map",
  resolve: {
    ...webpackResolve,
    alias: webpackAlias,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          presets: [babelPresets("legacy"), "@babel/preset-react"],
          plugins: [...settedBabelPlugins],
        },
        exclude: /node_modules\/(?!(swr|react-use-gesture|react-spring))/,
      },
      ...commonRules(),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/build/views/index.html"),
      filename: path.join(__dirname, "./public/views/index.html"),
      minify: {
        collapseWhitespace: true,
        removeComments: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new webpack.DefinePlugin({
      RENDER_OPTS: JSON.stringify(getCommandArg("render")),
    }),
    new ModuleHtmlPlugin(true),
  ],
  optimization: {
    minimize: !isDEV,
    minimizer: !isDEV
      ? [
          new TerserJSPlugin({
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 2015,
                warnings: false,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                safari10: true,
              },
              safari10: true,
            },
            extractComments: false,
            parallel: true,
            sourceMap: true,
          }),
        ]
      : [],
    runtimeChunk: true,
    splitChunks: webpackSplitChunks,
  },
}
