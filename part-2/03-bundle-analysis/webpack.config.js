const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const path = require("path");

module.exports = {
  mode: "development",

  entry: {
    app: "./src/app.js",
  },

  plugins: [new HtmlWebpackPlugin()],

  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: [
      //     "style-loader",
      //     {
      //       loader: "css-loader",
      //       options: {
      //         // 开启css模块
      //         modules: true,
      //       },
      //     },
      //     "postcss-loader",
      //   ],
      // },
      // CSS module
      {
        // 不带global的css文件
        test: new RegExp(`^(?!.*\\.global).*\\.css`),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                // 允许配置生成的本地标识符(ident),开发环境使用 '[path][name]__[local]',生产环境使用 '[hash:base64]'
                // [local] 占位符包含原始的类。
                localIdentName: "[hash:base64:6]",
              },
            },
          },
          "postcss-loader",
        ],
        exclude: [path.resolve(__dirname, "node_modules")],
      },
      // 普通模式
      {
        test: new RegExp(`^(.*\\.global).*\\.css`),
        use: ["style-loader", "css-loader", "postcss-loader"],
        exclude: [path.resolve(__dirname, "node_modules")],
      },
    ],
  },
};
