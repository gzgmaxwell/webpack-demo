const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/app.js",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],

  // 定义外部资源引入的形式
  externalsType: "script",
  externals: {
    // key: 与引用的包名一致
    // value: script标签加载的cdn对象所暴露出来的值
    jquery: [
      "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js",
      // 第二个参数为暴露的对象名
      "jQuery",
    ],
  },

  //   extensions: [".json", ".js"],
};
