const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
module.exports = {
  mode: "development",

  entry: "./src/index.js",

  plugins: [
    new HtmlWebpackPlugin(),
    new WorkboxPlugin.GenerateSW({
      // 快速启动 ServiceWorkers
      clientsClaim: true,
      // 不允许遗留旧的ServiceWorkers
      skipWaiting: true,
    }),
  ],

  devServer: {
    devMiddleware: {
      writeToDist: true,
    },
  },
};
