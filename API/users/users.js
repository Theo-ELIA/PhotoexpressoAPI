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
	var user_id = [1]
	var query = "SELECT shipping_fee, last_name, first_name, street_adress, postal_code, city, gender, quantity, price_per_unit, date_purchase, date_delivery FROM purchase_per_adress pa JOIN adress ON pa.shipping_adress_id = adress.id JOIN exemplary_quantity eq ON eq.purchase_id = pa.id JOIN purchase_historic ph ON pa.global_purchase_id = ph.id WHERE pa.customer_id = $1";
	database.connect(query, function(req, res), user_id) {
		if(err)
		{
			res.json({error:true});
		}
		res.json({result.rows});
	}
	res.send('listOrders !')
});

router.get('/validationMail',function(req,res)
{
	var query = "SELECT mail FROM customer WHERE mail = $1";
	var email = ["test@test.com"];
	database.connect(query, function(req, res), email) {
		if(err)
		{
			res.json({error:true});
		}
		res.json({result.rows});
	}
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
	var user_id = [1]
	var query = 'SELECT last_name, first_name, street_adress, postal_code, city, gender FROM contact_list cl LEFT JOIN adress ON cl.shipping_adress_id = adress.id WHERE cl.user_id = $1';
	database.connect(query, function(req, res), user_id) {
		if(err)
		{
			res.json({error:true});
		}
		res.json({result.rows});
	}
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