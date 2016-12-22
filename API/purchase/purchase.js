"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');
var APIpost = require('../function/APIpost');
var purchase_management = require('../function/purchase_management');

//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to purchase API')
})


//Il faut rajouter la photo dans les arguments du post exemplary_quantity_promise
router.post('/addExemplaries',function(req,res)
{
	var customer_id = 4;

	var purchase_id_promise = purchase_management.order_exist(customer_id);
	purchase_id_promise.then(function(purchase_id){
		console.log("Purchase Id Promise");
		console.log(purchase_id);
		console.log("Le purchase id:" + purchase_id + "\"");
		var purchase_id = purchase_id;
		//On fait les inserts pour creer la commande si elle existe deja (3 inserts), on la créée si elle n'existe pas
		var object_purchase_per_adress = { global_purchase_id : purchase_id , shipping_adress_id : req.body.shipping_adress_id}
		var purchase_per_adress_promise = APIpost.manageHTTP_POST(["global_purchase_id","shipping_adress_id"],object_purchase_per_adress,"purchases.purchase_per_adress");
		purchase_per_adress_promise.then(function(purchase_per_adress) {

			var purchase_per_adress_id = purchase_per_adress[0].id;
			var exemplary_promise = APIpost.manageHTTP_POST(["filter_id","format_id","message_delivery"],req.body,"purchases.exemplary");
			exemplary_promise.then(function(exemplary_result)
			{
				var exemplary_id = exemplary_result[0].id
				var exemplary_quantity_promise = APIpost.manageHTTP_POST(["exemplary_id","purchase_per_adress_id","quantity","price_per_unit"],{exemplary_id : exemplary_id, purchase_per_adress_id : purchase_per_adress_id, quantity : req.body.quantity, price_per_unit : req.body.price_per_unit},"purchases.exemplary_quantity");
				exemplary_quantity_promise.then(function()
				{
					res.json("{}");
				});
			})
			.catch(function(err){
				console.log(err);
			});
		})
		.catch(function(err) {
			console.log(err)
		})
	})
	.catch(function(err) {
		console.log("Error Add Exemplaries : " + err);
		res.json(err);
	})
});






router.get('/listOrders/:user_id',function(req,res)
{

	var query = "SELECT * FROM purchases.orders WHERE customer_id = $1";
	var promiseData = database.connect(query,[user_id]);

	promiseData.then(function(result){
		res.json(result);
	})
});








//We export the router so we can use it
module.exports = router;