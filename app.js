var express = require('express');
var cors = require('cors');
var http = require('http');
var token = require('./router/token')
var upload = require('./router/upload')
var home = require('./router/home');


var app = express();
app.use('/public',express.static('public'))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/users',home);
app.use('/upload',upload);

http.createServer(app).listen('9998',function() {
  console.log('服务启动');
})