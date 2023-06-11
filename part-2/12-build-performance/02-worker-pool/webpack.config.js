const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",

  entry: "./src/index.js",

  plugins: [new HtmlWebpackPlugin()],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          {
            loader: "thread-loader",
            options: {
              workers: 2,
            },
          },
        ],
      },
    ],
  },
};
