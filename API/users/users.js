"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');


//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to users API')
})

router.get('/connection',function(req,res)
{
	var token = jwt.sign({ id: 1 }, global.PRIVATE_KEY);
	var decoded = jwt.verify(token,global.PRIVATE_KEY);
	console.log(decoded.id) // bar 
	res.send('connection'+token)
});

router.get('/listOrders',function(req,res)
{
	res.send('list Orders !')
});

router.get('/validationMail',function(req,res)
{
	res.send('validationMail !')
});

router.get('/createAccount',function(req,res)
{
	res.send('createAccount !')
});

router.get('/modifyAccount',function(req,res)
{
	res.send('modifyAccount !')
});

router.get('/AdressList',function(req,res)
{
	res.send('AdressList !')
});

router.get('/createAddress',function(req,res)
{
	res.send('createAddress !')
});

router.get('/listUsers',function(req,res)
{
	var query = 'SELECT * FROM users.customers';
	database.connect(query,function(err,result) {
		if(err)
		{
			res.json({error : true});
		}
		res.json(result.rows);
	});


});



//We export the router so we can use it
module.exports = router;