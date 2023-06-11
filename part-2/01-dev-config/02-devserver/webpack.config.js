const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",

  entry: "./app.js",

  output: {
    publicPath: "/",
  },

  devtool: "cheap-module-source-map",

  devServer: {
    static: path.resolve(__dirname, "./dist"),
    // 设置是否在服务器端进行代码压缩，以减少传输过程中的数据大小
    // Accept-Encoding: gzip，说明服务器到客户端传输的过程中，文件是被压缩的
    compress: true,
    port: 3000,
    host: "0.0.0.0",
    headers: {
      "X-Access-Token": "adfasdfa",
    },
    proxy: {
      "/api": "http://localhost:9000",
    },
    // https: true,
    historyApiFallback: true,
    hot: true,
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
