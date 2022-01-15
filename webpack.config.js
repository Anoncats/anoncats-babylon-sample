const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  entry: path.resolve(appDirectory, "src/app.ts"), //path to the main .ts file
  output: {
    filename: "js/bundleName.js", //name for the javascript file that is created/compiled in memory
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", "json"],
  },
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    static: path.resolve(appDirectory, "public"), //tells webpack to serve from the public folder
    hot: true,
    devMiddleware: {
      publicPath: "/",
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(appDirectory, "public/index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [{ 
        from: path.resolve(appDirectory, "public"),
        globOptions: {
          ignore: [
            "**/index.html"
          ]
        }
      }]
  })
  ],
  mode: "development",
};