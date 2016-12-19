"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');


//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to purchase API')
})

router.post('/new',function(req,res)
{
	var purchase = [1, new Date(), []];
	var query = "INSERT INTO purchases.purchase_historic (customer_id, date_purchase) VALUES ($1, CURRENT_TIME)";
	//var decoded = jwt.verify(token,global.PRIVATE_KEY);
	//console.log(decoded.id)

		var query = "SELECT * FROM users.customers WHERE mail = $1 AND password = $2";
	database.connect(query, function(req, res){
		if(err)
		{
			res.json({error:true});
		}
		if(result.rows.length == 1)
		{
			var token = jwt.sign({ id: result.rows.id }, global.PRIVATE_KEY);
			res.json(token);
		}
		else
		{
			res.json({error:true});
		}

	}, [req.param.mail,req.param.password]);

});

router.get('/listOrders',function(req,res)
{
	var user_id = 4;
	var query = "SELECT * FROM purchases.orders WHERE customer_id = $1";
	database.connect(query, function(req, res) {
		if(err)
		{
			res.json({error:true});
		}
		else
		{
			res.json(result.rows);	
		}
	}, user_id);
});

router.get('/validationMail',function(req,res)
{
	var query = "SELECT mail FROM users.customers WHERE mail = $1";
	var email = ["ilovebarlouf@lycos.fr"];
	database.connect(query, function(err, result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	}, email);
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
	var user_id = [1];
	var query = 'SELECT last_name, first_name, street_adress, postal_code, city, gender FROM users.contact_list cl LEFT JOIN adress ON cl.shipping_adress_id = adress.id WHERE cl.user_id = $1';
	database.connect(query, function(err,result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	}, user_id);

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