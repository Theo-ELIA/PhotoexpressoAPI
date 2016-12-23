"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');
var APIget = require('../function/APIget');
var token = require('../function/token');



//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to users API')
});

router.post('/connection',function(req,res)
{
	var promise_connection = APIget.manageHTTP_GET(["*"],"users.customers",{mail : req.body.mail , password : req.body.password})

	promise_connection
		.then(function(identifier) {
			if(identifier.length === 1) {
				var token = jwt.sign({idCustomer : identifier.id, expirationDate : Date.now(), role : "CUSTOMER"},global.PRIVATE_KEY);
				res.json(token)
			}
			else
			{
				res.json({ error : true , error_description : "Incorrect credentials"})
			}
		})
		.catch(function(error) {
			console.log(error);
			res.status(404);
		})

});



router.get('/listOrders/',function(req,res)
{

	if(!token.verifyToken(req.headers["token"],"ADMIN")) {
		res.json({ error : true , error_description : "You don't have the right to see that."})
	}
	else {
		var query = "SELECT * FROM purchases.old_orders";
		var promiseData = database.connect(query);

		promiseData.then(function(result,err)
		{
			if(err)
			{
				console.log("Error : ");
				console.log(err);
				res.json({error:true});
			}
			else
			{
				res.json(result);
			}
		})
		.catch(function(err){
			console.log(err);
			res.status(405);
		})
	}
});





router.get('/orders/customer/:idCustomer',function(req,res) {
	var idCustomer = req.params.idCustomer;
	if(idCustomer != parseInt(idCustomer,10)) {
		res.json( { error : true , error_description : "The id Account parameter must be an integer"} );

	}
	idCustomer = parseInt(idCustomer, 10)
	var promise_order = APIget.manageHTTP_GET(["*"],"purchases.old_orders",{c_id : idCustomer})
	promise_order.then(function(orders) {
		res.json(orders);
	})
	.catch(function(err) {
		console.log(err);
		res.status(500);
	})
});

router.get('/order/order/:idOrder',function(req,res) {
	var idOrder = req.params.idOrder;
	if(idOrder != parseInt(idOrder,10)) {
		res.json( { error : true , error_description : "The id Account parameter must be an integer"} );

	}
	idOrder = parseInt(idOrder, 10)
	var promise_order = APIget.manageHTTP_GET(["*"],"purchases.old_orders",{ph_id : idOrder})
	promise_order.then(function(orders) {
		if(orders.length > 0) {
			res.json(orders);
		}
		else {
			res.json( { error : true , error_description : "The order doesn't exist"} )
		}
	})
	.catch(function(err) {
		console.log(err);
		res.status(500);
	})
});

//??????????????? ca devrait être dans le fichier purchase
router.delete('/deleteOrders',function(req,res)
{});

router.post('/addOrders',function(req,res)
{});
//???????????????

//fonction validee
router.get('/validationMail',function(req,res)
{
	var query = "SELECT mail FROM users.customers WHERE mail = $1";
	var email = "test@test.com";
	database.connect(query, function(err,result) {
		if(err) {
			res.json({error:true});
		}
		else {
			res.json(result.rows);
		}

	}, [email])
});

router.get('/listAccounts',function(req,res)
{
	var query = 'SELECT * FROM users.customers';
	database.connect(query,function(err,result) {
		if(err)
		{
			res.json({error : true});
		}
		else
		{
		res.json(result.rows);
		}
	});
});

router.post('/createAccounts',function(req,res)
{
	var query = "INSERT INTO users.customers (last_name, first_name, password, mail, billing_adress_id, gender) VALUES ($1,$2,$3,$4,$5,$6)";
	//mettre un trigger dans la BDD qui vérifie la validité d'un mail
	database.connect(query, function(err,result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	}, [req.param.last_name, req.param.first_name, req.param.password, req.param.mail, req.param.billing_adress_id, req.param.gender]);
});


router.post('/updateAccounts',function(req,res)
{
	res.send('modifyAccount !');
});

router.delete('/deleteAccounts',function(req,res)
{
	res.send('Delete Accounts !');
});



router.get('/account/:idAccount',function(req,res)
{
	var idUser = req.params.idAccount;
	if(idUser != parseInt(idUser, 10) ) {
		res.json( { error : true , error_description : "The id Account parameter must be an integer"} );
	}

	idUser = parseInt(idUser, 10);
	APIget.manageHTTP_GET(['*'],"users.customers",{ id : idUser })
		.then(function(result) {
				console.log(result);
				if(result.length == 0) 
				{
					result = { error : true, error_description : "No was Account found for this ID" };
				}
			res.json(result);
		})
		.catch(function(err)
		{
			console.log(err);
		})
});



router.get('/listAdressList/:idClient',function(req,res)
{
	var user_id = req.params.idClient;
	var query = 'SELECT last_name, first_name, street_adress, postal_code, city, gender FROM contact_list cl LEFT JOIN adress ON cl.shipping_adress_id = adress.id WHERE cl.user_id = $1';
	database.connect(query, function(err, result) {
		if(err)
		{
			res.json({error:true});
		}
		else {
		res.json(result.rows);
		}
	}, user_id);
});



router.post('/addAdress',function(req,res)
{
	res.json(APIpost.manageHTTP_POST(['last_name','first_name','street_adress','postal_code','city','gender'],req.body,"users.adress"));
});

router.post('/deleteAdress/:idAdress',function(req,res)
{
	res.send('Deleting Adress :' + req.params.idAdress);
});



router.get('/adress/:idAdress',function(req,res)
{
	var idAdress = req.params.idAdress
	if(idAdress != parseInt(idAdress, 10)) {
		res.json( { error : true , error_description : "The id Adress parameter must be an integer"} );
	}
	
	idAdress = parseInt(idAdress, 10);
	APIget.manageHTTP_GET(['*'],"users.adress",{ id : idAdress })
		.then(function(result) {
				console.log(result);
				if(result.length == 0) 
				{
					result = { error : true, error_description : "No Adress was found for this ID" };
				}
			res.json(result);
		})
		.catch(function(err)
		{
			console.log(err);
		})
});
//We export the router so we can use it
module.exports = router;