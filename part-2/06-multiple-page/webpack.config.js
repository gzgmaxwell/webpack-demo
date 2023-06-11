const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  entry: {
    main: {
      import: ["./src/app.js", "./src/app2.js"],
      // main内部打包的文件可能依赖于lodash，而lodash已经被单独打包，不需要再main再打包
      dependOn: "lodash",
      filename: "chanel1/[name].js",
    },
    main2: {
      import: "./src/app3.js",
      dependOn: "lodash",
      filename: "chanel2/[name].js",
    },
    lodash: { import: "lodash", filename: "common/[name].js" },
  },

  output: {
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      // 可以将index.html中的内容在webpack.config.js中定义
      title: "SPA APP",
      template: "./index.html",
      // 定义打包文件的引入位置
      inject: "body",
      // chunk即entry中配置的项,默认会引入全部chunk
      chunks: ["main", "lodash"],
      filename: "chanel1/index.html",
      publicPath: "http://www.a.com/",
    }),

    new HtmlWebpackPlugin({
      template: "./index2.html",
      inject: "body",
      chunks: ["main2", "lodash"],
      filename: "chanel2/index2.html",
      publicPath: "http://www.b.com/",
    }),
  ],
};
