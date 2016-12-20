"use strict";
var express = require('express');

global.PRIVATE_KEY = "Jean-Pierre Coffe";
//We import the files we need
var photoOptionPath = require('./photo_option/photoOption');
var usersPath = require('./users/users');
var purchasePath = require('./purchase/purchase');

var router = express.Router() //This variable represent the routing of our application
router.use(function (req, res, next) {
	if(req.params) {
		console.log(req.body.test_json);
	}
	next()
})
router.use('/users/',usersPath);
router.use('/photo_options/',photoOptionPath);
router.use('/purchases/',purchasePath);


router.get('/',function(req,res){
	res.send('Welcome to photoexpressoAPI')
})




//We export the router so we can use it
module.exports = router
