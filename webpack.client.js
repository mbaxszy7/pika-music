const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WorkboxPlugin = require("workbox-webpack-plugin")
const WebpackPwaManifest = require("webpack-pwa-manifest")
// const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")
const {
  isDEV,
  webpackPlugins,
  babelPlugins,
  babelPresets,
  webpackResolve,
  getCommandArg,
  commonRules,
  webpackSplitChunks,
} = require("./webpack.common.js")
const ModuleHtmlPlugin = require("./module-html-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

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

module.exports = (env, argv) => {
  return {
    target: ["web", "es6"],
    entry: {
      client: path.resolve(__dirname, "./src/client/index.js"),
    },
    output: {
      publicPath: isDEV ? "/" : "/public/",
      filename: isDEV ? "[name]-[hash].js" : `[name]-[contenthash].js`,
      chunkFilename: isDEV ? "[name]-[hash].js" : `[name]-[contenthash].js`,
      path: path.resolve(__dirname, "public"),
    },
    devServer: {
      proxy: {
        "/api": {
          target: "https://111.229.78.115",
          // 修改发往 target的host: "localhost:8010", referrer: "http://localhost:8010/"
          changeOrigin: true,
          secure: false,
        },
      },
      publicPath: "/",
      historyApiFallback: true,
      port: 8010,
      compress: true,
      contentBase: path.join(__dirname, "./public"),
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
            presets: [babelPresets(), "@babel/preset-react"],
            plugins: [...settedBabelPlugins],
          },
          exclude: /node_modules/,
        },
        ...commonRules(),
      ],
    },
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      ...webpackPlugins,
      isDEV
        ? new HtmlWebpackPlugin({
            title: "music-motion",
            template: path.resolve(__dirname, "./index.html"),
          })
        : new HtmlWebpackPlugin({
            minify: {
              collapseWhitespace: true,
              removeComments: false,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            },
            title: "music-motion",
            template: path.resolve(__dirname, "./src/assets/index.html"),
            filename:
              env.module === "yes"
                ? path.join(__dirname, "./public/views/index.html")
                : path.join(__dirname, "./public/build/views/index.html"),
            favicon: path.resolve(__dirname, "./src/assets/favicon.ico"),
          }),
      new webpack.DefinePlugin({
        RENDER_OPTS: JSON.stringify(getCommandArg("render")),
      }),
      new WebpackPwaManifest({
        name: "Pika",
        short_name: "Pika",
        description: "A PWA Muisc Web Site",
        display: "standalone",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#FEDD27",
        inject: true,
        ios: true,
        scope: "/",
        icons: [
          {
            src: path.resolve(__dirname, "./src/assets/pika_tail_192x192.png"),
            sizes: "192x192",
            type: "image/png",
            ios: true,
          },
          {
            src: path.resolve(__dirname, "./src/assets/pika_tail_512x512.png"),
            sizes: "512x512",
            type: "image/png",
            ios: true,
          },
          {
            src: path.resolve(__dirname, "./src/assets/pika_tail_152x152.png"),
            sizes: "152x152",
            type: "image/png",
            ios: true,
          },
        ],
      }),
      new WorkboxPlugin.InjectManifest({
        swSrc: path.join(process.cwd(), "./src/src-service-worker.js"),
        swDest: "service-worker.js",
        exclude: [
          /\.map$/,
          /manifest$/,
          /\.htaccess$/,
          /service-worker\.js$/,
          /sw\.js$/,
          /\.webp$/,
        ],
      }),
      new ModuleHtmlPlugin(),
      new BundleAnalyzerPlugin(),
    ],
    optimization: {
      minimize: !isDEV,
      minimizer: !isDEV
        ? [
            new TerserJSPlugin({
              terserOptions: {
                parse: {
                  // we want terser to parse ecma 8 code. However, we don't want it
                  // to apply any minfication steps that turns valid ecma 5 code
                  // into invalid ecma 5 code. This is why the 'compress' and 'output'
                  // sections only apply transformations that are ecma 5 safe
                  // https://github.com/facebook/create-react-app/pull/4234
                  ecma: 8,
                },
                compress: {
                  ecma: 2015,
                  warnings: false,
                },
                output: {
                  ecma: 2015,
                  comments: false,
                  safari10: false,
                },
                safari10: false,
              },
              extractComments: false,
              // cache: true,
              parallel: true,
              sourceMap: true, // Must be set to true if using source-maps in production
            }),
          ]
        : [],
      runtimeChunk: true,
      splitChunks: webpackSplitChunks,
    },
  }
}
