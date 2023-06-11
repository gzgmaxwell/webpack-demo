const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",

  entry: "./app.js",

  devtool: "cheap-module-source-map",

  devServer: {
    static: path.resolve(__dirname, "./dist"),
    // 设置是否在服务器端进行代码压缩，以减少传输过程中的数据大小
    // Accept-Encoding: gzip，说明服务器到客户端传输的过程中，文件是被压缩的
    compress: true,
    port: 3000,
    headers: {
      "X-Access-Token": "adfasdfa",
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },

  plugins: [new HtmlWebpackPlugin()],
};
