"use strict";
//We import the library we need
var express = require('express');
var path = require("path");
 var httpProxy = require('http-proxy');
var apiPath = require('./API/api');
//We create our application
var app = express();
var apiProxy = httpProxy.createProxyServer();//We import the file we need



var port = 80
var hostname = '192.168.11.112';
var allhostname = '0.0.0.0';

var serverPHPPGAdmin = "http://127.0.0.1:8080"
var effectiveHost = allhostname;

app.use('/outTemp/', express.static(__dirname+'/outTemp'))
app.use('/API/',apiPath)
//app.use('/pictures/',picturesRoute)

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/public/html/index.html'));
});

app.get('/report_error', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/html/report_error.html'));
});

app.all("/phppgadmin/*", function(req, res) {
    apiProxy.web(req, res, {target: serverPHPPGAdmin});
});



app.listen(port, effectiveHost, function(){
  console.log('Server running at http://'+effectiveHost+':'+port+'/');
});
