const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
module.exports = {
  mode: "production",

  entry: "./src/index.js",

  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "./dll/manifest.json"),
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, "./dll/jquery.js"),
      publicPath: "./",
    }),
  ],
};
