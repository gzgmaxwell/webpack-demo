const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: "production",
  // 配置的是node_modules里安装的第三方的包
  entry: {
    jquery: ["jquery"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dll"),
    library: "[name]_[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]_[hash]",
      path: path.resolve(__dirname, "dll/manifest.json"),
    }),
  ],
};
