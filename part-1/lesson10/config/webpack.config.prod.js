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
    filename: "scripts/[name].[contenthash].js",
  },

  mode: "development",

  // 优化相关的配置
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],

    performance: {
      hints: false,
    },
  },
};
