const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")
const webpack = require("webpack")
const { ReactLoadablePlugin } = require("react-loadable/webpack")
const {
  isDEV,
  webpackPlugins,
  babelPlugins,
  babelPresets,
  webpackResolve,
  getCommandArg,
  commonRules,
} = require("./webpack.common.js")

module.exports = {
  entry: path.resolve(__dirname, "./src/client/index.js"),
  output: {
    publicPath: "/public/",
    // filename: `application-[${isDEV ? "chunkhash" : "contenthash"}].js`,
    filename: "client.js",
    chunkFilename: `[name]-[${isDEV ? "chunkhash" : "contenthash"}].js`,
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.0.115:9000",
      },
    },
    historyApiFallback: true,
    port: 8010,
    compress: true,
    contentBase: path.join(__dirname, "./public"),
  },
  devtool: "cheap-module-eval-source-map",
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
      ...commonRules(),
    ],
  },
  plugins: [
    ...webpackPlugins,
    new HtmlWebpackPlugin({
      title: "music-motion",
      template: path.resolve(__dirname, "./src/index.html"),
    }),
    new webpack.DefinePlugin({
      RENDER_OPTS: JSON.stringify(getCommandArg("render")),
    }),
    new ReactLoadablePlugin({
      filename: "./public/react-loadable.json",
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      swDest: "service-worker.js",
      runtimeCaching: [
        {
          urlPattern: new RegExp("http://localhost:7004"),
          handler: "NetworkFirst",
        },
      ],
    }),
  ],
  // optimization: {
  //   runtimeChunk: {
  //     name: "single",
  //   },
  //   splitChunks: {
  //     chunks: "all",
  //     minSize: 30000,
  //     maxSize: 0,
  //     minChunks: 1,
  //     maxAsyncRequests: 6,
  //     maxInitialRequests: 4,
  //     automaticNameDelimiter: "-",
  //     automaticNameMaxLength: 30,
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10,
  //         chunks: "all",
  //         name: "vendors",
  //       },
  //       default: {
  //         name: "commmon",
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true,
  //       },
  //     },
  //   },
  // },
}
