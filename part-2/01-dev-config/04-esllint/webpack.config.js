const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  plugins: [
    new HtmlWebpackPlugin(),
    new ESLintPlugin(),
  ],
  devServer: {
    // 指定server的根目录
    static: './dist',
    client: {
      overlay: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
    ],
  },
};
