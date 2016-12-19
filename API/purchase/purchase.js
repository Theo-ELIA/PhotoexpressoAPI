"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');


//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to users API')
})

router.post('/new',function(req,res)
{
	var purchase = [1, new Date(), []];
	var query = "INSERT INTO purchase.purchase_historic (customer_id, date_purchase) VALUES ($1, CURRENT_TIME)";
	database.connect(query, function(err, result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	}, purchase);
});




//We export the router so we can use it
module.exports = router;