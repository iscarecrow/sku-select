"use strict";

var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.dev');
var express = require('express');
var proxy = require('express-http-proxy');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxyStatic = require('proxy-middleware');
var url = require('url');
var apiDomain = require('./config/devHost');

var app = express();

app.use(cookieParser());

app.use('/napi/*', proxy(apiDomain, {
  forwardPath: function(req, res) {
    return req.originalUrl;
  }
}));

// server proxy
app.use('/static/', proxyStatic(url.parse('http://localhost:8080/static/')));


app.get('/**', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  noInfo: false,
  stats: { colors: true }
});


server.listen(8080, "localhost", function() {});

app.listen(8081);