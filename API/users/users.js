"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');
var APIget = require('../function/APIget');


//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to users API')
});

router.get('/connection',function(req,res)
{
	//var decoded = jwt.verify(token,global.PRIVATE_KEY);
	//console.log(decoded.id)

		var query = "SELECT * FROM user.customers WHERE mail = $1 AND password = $2";
	database.connect(query, function(err, result){
		if(err)
		{
			res.json({error:true});
			console.error(err)
		}
		if(result.rows.length == 1)
		{
			var token = jwt.sign({ id: result.rows.id, role : "client", date_expiration_token : Date.now()  }, global.PRIVATE_KEY);
			res.json(token);
		}
		else
		{
			res.json({error:true});
		}

	}, [mail,password]);

});



router.get('/listOrders',function(req,res)
{
	var query = "SELECT * FROM purchases.old_orders WHERE user_id = $1";
	var promiseData = database.connect(query, [req.param.user_id]);

	promiseData.then(function(err,result)
	{
		if(err)
		{
			res.json({error:true});
		}
		else
		{
			res.json(result.rows);
		}
	});
});





router.get('/orders/customer/:idCustomer',function(req,res) {
	var idCustomer = req.params.idCustomer;
	var promise_orders = manageHTTP_GET(["*"],"purchases.orders",{ ph_customer: idCustomer})
	promise_orders.then(function(orders) {
		res.json(orders);
	});
});

router.get('/order/order/:idOrder',function(req,res) {
	var idOrder = req.params.idOrder;
	var promise_order = manageHTTP_GET(["*"],"purchases.orders",{ph_id : idOrder})
	promise_order.then(function(orders) {
		res.json(order);
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
	if(!Number.isInteger)
	{
		res.json( { error : true , error_description : "The id Account parameter must be an integer"} );
	}

	console.log(req.params);
	var idUser = Number(req.params.idUsers);
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
		if(!Number.isInteger)
	{
		res.json( { error : true , error_description : "The id Adress parameter must be an integer"} );
	}

	console.log(req.params);
	var idAdress = Number(req.params.idAdress);
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