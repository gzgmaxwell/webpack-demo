const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    // 清理当前打包之外的文件
    clean: true,
  },

  mode: "production",

  // HtmlWebpackPlugin: index.html的自动生成，有对应的srcipt标签引入文件
  plugins: [
    new HtmlWebpackPlugin({
      // 基于template对应的文件打包生成html
      template: "./index.html",
      filename: "app.html",
      // script标签的生成位置
      inject: "body",
    }),
  ],
};
