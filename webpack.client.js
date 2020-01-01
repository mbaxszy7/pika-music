const path = require("path")
const LoadablePlugin = require("@loadable/webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const {
  isDEV,
  babelPlugins,
  babelPresets,
  webpackResolve,
  getCommandArg,
} = require("./webpack.common.js")

module.exports = {
  entry: path.resolve(__dirname, "./src/client/index.js"),
  output: {
    publicPath: "/dist/client/",
    // filename: `application-[${isDEV ? "chunkhash" : "contenthash"}].js`,
    filename: "client.js",
    chunkFilename: `[name]-[${isDEV ? "chunkhash" : "contenthash"}].js`,
    path: path.resolve(__dirname, "dist/client"),
  },
  devServer: {
    historyApiFallback: true,
    port: 8010,
    compress: true,
  },
  resolve: {
    ...webpackResolve,
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          presets: [babelPresets(), "@babel/preset-react"],
          plugins: [...babelPlugins, "react-hot-loader/babel"],
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "music-motion",
      template: path.resolve(__dirname, "./src/index.html"),
    }),
    new webpack.DefinePlugin({
      RENDER_OPTS: JSON.stringify(getCommandArg("render")),
    }),
    new LoadablePlugin(),
  ],
}
