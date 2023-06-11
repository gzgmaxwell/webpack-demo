const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  //   experiments: { outputModule: true },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "webpack-numbers.js",
    library: {
      name: "webpackNumbers",
      // 当type=module时，name是不能设置的
      type: "umd",
    },
    // 用全局的this代替self
    globalObject: "globalThis",
  },
  externals: {
    lodash: {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_",
    },
  },
};
