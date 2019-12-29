const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/client/index.js'),
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'public'),
  },
  devServer: {
    port: 9000,
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                modules: false,
                debug: true,
                corejs: { version: 3, proposals: true },
              },
            ],
            '@babel/preset-react',
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'music-motion',
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
}
