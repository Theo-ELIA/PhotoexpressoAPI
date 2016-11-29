"use strict";
var express = require('express');

global.PRIVATE_KEY = "Jean-Pierre Coffe";
global.SQLconfig = {
	  user: 'admin', //env var: PGUSER 
	  database: 'photoexpresso', //env var: PGDATABASE 
	  password: 'admin', //env var: PGPASSWORD 
	  port: 5432, //env var: PGPORT 
	  max: 10, // max number of clients in the pool 
	  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};
//We import the files we need
var usersPath = require('./users/users');
var router = express.Router() //This variable represent the routing of our application
router.use('/users/',usersPath);


router.get('/',function(req,res){
	res.send('Welcome to users')
})




//We export the router so we can use it
module.exports = router