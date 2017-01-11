var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "eval",
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, "./static/"),
    filename: "bundle.js",
    publicPath: "/static/"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['react-hot','babel?presets[]=react,presets[]=es2015'],
    }]
  },
  resolve: {
    alias: {
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};