const path = require('path');

var webpack = require("webpack");

console.log('LOG', path.resolve(__dirname, 'dist'))
module.exports = {
  mode: 'development',
  entry: {
    main: {
      import: './src/index.js',
    },
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
      directory: path.join(__dirname, './dist/'),  
      watch: true
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    })
  ]
};