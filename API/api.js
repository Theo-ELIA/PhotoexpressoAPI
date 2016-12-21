"use strict";
var express = require('express');

global.PRIVATE_KEY = "Jean-Pierre Coffe";
//We import the files we need
var photoOptionPath = require('./photo_option/photoOption');
var usersPath = require('./users/users');
var purchasePath = require('./purchase/purchase');
var apipost = require('./function/APIpost');
apipost.manageHTTP_POST(["filter_name","filter_price"],{filter_name: "TooManyFilter",filter_price:2.34},"photo_options.filter",[],{id_name : "id", id_to_update : 6});
var router = express.Router() //This variable represent the routing of our application
router.use(function (req, res, next) {

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
