const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const toml = require("toml");
const yaml = require("yaml");
const json = require("json");

module.exports = {
  output: {
    // filename: "bundle.js",
    // [name]是入口chunk的key的名字
    filename: "scripts/[name].js",
  },

  mode: "development",

  // 将代码直接映射到打包好的js文件中
  devtool: "inline-source-map",

  // webpack-dev-server实际没有输出任何的文件，它将打包好的bundle.js放在了内存里
  devServer: {
    // 指定server的根目录
    static: "./dist",
  },
};
