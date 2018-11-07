const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path')

const distPath = path.join(__dirname, '../dist')
const dataPath = path.join(__dirname, '../server/data')
module.exports = {
    target:'node',
    entry: path.join(__dirname, '../server/index.js'),
    output: {
      path: distPath,
      filename: 'server.js'
    },
    devtool: 'none',
    module: {
      rules: [{
          test: /(\.jsx|\.js)$/,
          use: {
            loader: "babel-loader"
          },
          exclude: /node_modules/
        }]
  },
  node: {
		__filename: false,
		__dirname: false
	},
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      root: path.join(__dirname, '../'),
      verbose: true, //开启在控制台输出信息
      dry: false,
    }),
    new CopyWebpackPlugin([{
      from: dataPath,
      to: path.join(distPath, 'data'),
    }]),
  ]
}