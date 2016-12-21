"use strict";
//We import the library we need
var express = require('express');
var path = require("path");
var httpProxy = require('http-proxy');
var argv = require('optimist').argv;

//We create our application
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var apiProxy = httpProxy.createProxyServer();//We import the file we need

//We parse the arguments of the script
global.isDebugMode = (argv.debug != undefined);
if(global.isDebugMode) {
	console.log("Debug Mode enabled")
}
var apiPath = require('./API/api');
var port

if (argv.local)
{
	port = 8080
}
else
{
	port = 80
}

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



app.listen(port || 8080, effectiveHost, function(){
  console.log('Server running at http://'+effectiveHost+':'+port+'/');
});
