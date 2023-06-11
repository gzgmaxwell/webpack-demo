const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  mode: "production",
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin(),
    new ModuleFederationPlugin({
      // 别的组件需要通过name访问当前组件
      name: "nav",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        // key:拼接路径
        "./Header": "./src/Header.js",
      },
      // 共享第三方模块，会被单独打包
      shared: {},
    }),
  ],
};
