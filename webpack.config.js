const path = require('path');

const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

console.log('LOG', path.resolve(__dirname, 'dist'))
module.exports = {
  mode: 'development',
  entry: {
    main: {
      import: './src/index.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "auto"
  },
  devServer: {
    compress: true,
    watchFiles: ['src/**/*.js', 'public/**/*'],
    static: {                               
      directory: path.join(__dirname, './public/'),  
      watch: true
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    })
  ]
};