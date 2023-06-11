const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin(),
    // 设置全局模块
    new webpack.ProvidePlugin({
      _: "lodash",
    }),
  ],
  module: {
    rules: [
      //   {
      //     test: require.resolve("./src/index.js"),
      //     // this指向了window
      //     use: "imports-loader?wrapper=window",
      //   },
      {
        test: require.resolve("./src/globals.js"),
        // 按照commonjs的方式导出一个file变量
        // multiple表示导出一个key-value类型的
        // helpers.parse为值，parse为键
        use: "exports-loader?type=commonjs&exports=file,multiple|helpers.parse|parse",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  // browserList里定义的内容
                  targets: ["last 1 version", "> 1%"],
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
