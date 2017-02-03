"use strict";

//We import the library we need
var express = require('express'); //Framework to create REST API
var path = require("path"); //Module to generate Path to static files
var httpProxy = require('http-proxy'); //Module to do reverse proxy
var argv = require('optimist').argv; //Module to process Console arguments
const winston = require('winston'); // Module to manage logging
//We set the parameters of our application

//Default Mode
var mode = "debug";

if(argv.mode) {
	mode = argv.mode;
}
//We import the configuration from the configuration file
var config = require('./config/application.conf.js').getConfiguration(mode);

if(!config) {
	process.exit(1);
}


var logger = new (winston.Logger)({
	level : config.loggingLevel,
	transports: [
		new (winston.transports.Console)({colorize: true,}),
		new (winston.transports.File)({ colorize: true, filename: './server.log' })
	]
});
if(mode === 'debug') {
	logger.debug('Running mode : ' + mode);
}
logger.debug(config);



//We create our application
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var apiProxy = httpProxy.createProxyServer();//We import the file we need
var apiPath = require('./API/api');

var serverPHPPGAdmin = "http://127.0.0.1:8080";

app.use('/outTemp/', express.static(__dirname+'/outTemp'));
app.use('/API/',apiPath);


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/public/html/index.html'));
});

app.get('/report_error', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/html/report_error.html'));
});

app.all("/phppgadmin/*", function(req, res) {
    apiProxy.web(req, res, {target: serverPHPPGAdmin});
});

app.listen(config.port || 8080, config.listening_interface, function(){
  console.log('Server running at http://'+config.listening_interface+':'+config.port+'/');
});
