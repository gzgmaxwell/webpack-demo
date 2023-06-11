const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },

  mode: "production",

  // HtmlWebpackPlugin: index.html的自动生成
  plugins: [new HtmlWebpackPlugin()],
};
