const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const toml = require("toml");
const yaml = require("yaml");
const json = require("json");

module.exports = (env) => {
  console.log(env);
  return {
    entry: {
      index: "./src/index.js",
      another: "./src/another-module.js",
    },

    output: {
      // filename: "bundle.js",
      // [name]是入口chunk的key的名字
      filename: "scripts/[name].[contenthash].js",
      path: path.resolve(__dirname, "./dist"),
      // 清理当前打包之外的文件
      clean: true,
      // webpack默认生成文件名：[contenthash]，根据文件的内容生成一个哈希的字符串
      // [ext]表示源文件的扩展名
      assetModuleFilename: "images/[contenthash][ext]",
      publicPath: "http://localhost:8080/",
    },

    mode: env.production ? "production" : "development",

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
      new MiniCssExtractPlugin({
        filename: "styles/[contenthash].css",
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
        {
          test: /\.(css|less)$/,
          // css-loader用于打包，正确识别css文件
          // style-loader去真正引入css文件
          // 顺序是不可以颠倒的，会从右向左使用
          // use: ["style-loader", "css-loader", "less-loader"],
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)/,
          type: "asset/resource",
        },
        {
          test: /\.(csv|tsv)$/,
          use: "csv-loader",
        },
        {
          test: /\.xml$/,
          use: "xml-loader",
        },
        {
          test: /\.toml$/,
          type: "json",
          parser: {
            parse: toml.parse,
          },
        },
        {
          test: /\.yaml$/,
          type: "json",
          parser: {
            parse: yaml.parse,
          },
        },
        {
          test: /\.json$/,
          type: "json",
          parser: {
            parse: json.parse,
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              // plugins: [["@babel/plugin-transform-runtime"]],
            },
          },
        },
      ],
    },

    // 优化相关的配置
    optimization: {
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],

      // 抽离公共代码的插件
      splitChunks: {
        // chunks: "all",
        // 缓存组，缓存第三方文件
        cacheGroups: {
          // vendor:提取公共方法
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
  };
};
