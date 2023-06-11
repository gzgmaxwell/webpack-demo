const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "production",

  entry: "./src/app.js",

  plugins: [new HtmlWebpackPlugin()],

  //   devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  optimization: {
    usedExports: true,
  },
};
