const path = require("path")
const nodeExternals = require("webpack-node-externals")
const webpack = require("webpack")
const {
  isDEV,
  babelPlugins,
  babelPresets,
  webpackResolve,
  getCommandArg,
  webpackPlugins,
  commonRules,
} = require("./webpack.common.js")

module.exports = {
  target: "node",
  devtool: "cheap-module-eval-source-map",
  entry: {
    main: [path.resolve(__dirname, "src/server/index.js")],
  },
  output: {
    filename: "bundle.js",
    chunkFilename: `[name]-[${isDEV ? "chunkhash" : "contenthash"}].js`,
    path: path.resolve(__dirname, "public/server"),
  },
  resolve: webpackResolve,
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          presets: [babelPresets("node"), "@babel/preset-react"],
          plugins: babelPlugins,
        },
        exclude: /node_modules/,
      },
      ...commonRules(),
    ],
  },
  plugins: [
    ...webpackPlugins,
    new webpack.DefinePlugin({
      RENDER_OPTS: JSON.stringify(getCommandArg("render")),
    }),
  ],
  optimization: {
    splitChunks: false,
  },
}
