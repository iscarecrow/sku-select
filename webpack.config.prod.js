var path = require("path");
var webpack = require("webpack");

module.exports = {
  devtool: "cheap-module-eval-source-map",
  entry: {
    'app': './src/index',
    'common': ["react","react-dom"]
  },
  output: {
    path: path.join(__dirname, "./static/"),
    filename: "[name].js",
    publicPath: "/static/"
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"common", /* filename= */"common.js"),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
         warnings: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['babel?presets[]=react,presets[]=es2015'],
    }]
  }
};