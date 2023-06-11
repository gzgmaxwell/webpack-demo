const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    // 清理当前打包之外的文件
    clean: true,
    // webpack默认生成文件名：[contenthash]，根据文件的内容生成一个哈希的字符串
    // [ext]表示源文件的扩展名
    assetModuleFilename: "images/[contenthash][ext]",
  },

  mode: "development",

  // 将代码直接映射到打包好的js文件中
  devtool: "inline-source-map",

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

  // webpack-dev-server实际没有输出任何的文件，它将打包好的bundle.js放在了内存里
  devServer: {
    // 指定server的根目录
    static: "./dist",
  },

  module: {
    rules: [
      {
        test: /\.png$/,
        type: "asset/resource",
        generator: {
          filename: "images/[contenthash][ext]",
        },
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
      {
        test: /\.txt$/,
        type: "asset/source",
      },
      {
        test: /\.jpg$/,
        type: "asset",
        parser: {
          // 自定义是否在dist下创建新文件的临界值
          dataUrlCondition: {
            maxSize: 4 * 1024 * 1024, // 即4mb
          },
        },
      },
    ],
  },
};
