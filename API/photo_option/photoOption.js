"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');
var APIget = require('../function/APIget');


//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to photoOption API')
})

/*Format */
router.get('/listFormats',function(req,res) {

	APIget.manageHTTP_GET(['*'],"photo_options.format")
		.then(function(result) {
				console.log(result);
				res.json(result);
		})
		.catch(function(err)
		{
			console.log(err);
		})
});


router.get('/listFormatsAvailable/:idFilter',function(req,res)
{
	var query = "SELECT * FROM photo_options.format f RIGHT JOIN photo_options.incompatibility i ON f.format_id = i.format_id WHERE i.format_id <> $1";
	database.connect(query, function(err,result) {
		if(err) {
			res.json({error:true});
		}
		else {
			res.json(result.rows);
		}
	}, [req.param.format_id]);
});

router.post('/addFormats', function(req, res)
{
	if(req.body.format_name && req.body.format_price)
	{
		var query = "INSERT INTO photo_options.format (format_name, format_price) VALUES ($1,$2)";
		database.connect(query, function(err,result) {
			if(err)
			{
				res.json({error:true});
			}
			else
			{
				res.json(result.rows);
			}
		}, [req.body.format_name,req.body.format_price]);
	}
	else
	{
		res.json({error:true,error_msg:"Suffisent parameters weren't not supplied"})
	}
});


router.post('/updateFormats', function(req, res)
{

});

router.post('/deleteFormats', function(req, res)
{

});

router.get('/format/:idFormat', function(req, res)
{
	if(!Number.isInteger) {
		res.json( { error : true , error_description : "The id Format parameter is not an integer"} );
	}

	var idFormat = Number(req.params.idFormat);
	APIget.manageHTTP_GET(['*'],"photo_options.format",{ id : idFormat })
		.then(function(result) {
				console.log(result);
				if(result.length == 0) {
					result = { error : true, error_description : "No was format was found for this ID" };
				}
			res.json(result);
		})
		.catch(function(err)
		{
			console.log(err);
		})

});

/*Filters*/
router.get('/listFilters',function(req,res)
{
	var query = "SELECT * FROM photo_options.filter";
	var promiseDatabase = database.connect(query)
	console.log("Promesse dans la fonction");
	console.log(promiseDatabase);
	promiseDatabase.then(function(result) {
		res.json(result);
	})
	.catch(function(err) {
		console.log(err);
		res.status(408);
	});

});

router.post('/addFilters', function(req, res)
{
	res.json(APIpost.manageHTTP_POST(['filter_name','filter_price'],req.body,"photo_options.filter"));
});

router.post('/updateFilters', function(req, res)
{

});

router.post('/deleteFilters', function(req, res)
{

});

router.get('/filter/:idFilter', function(req, res)
{
	if(!Number.isInteger) {
		res.json( { error : true , error_description : "The id Filter parameter is not an integer"} );
	}

	console.log(req.params);
	var idFilter = Number(req.params.idFilter);
	APIget.manageHTTP_GET(['*'],"photo_options.filter",{ id : idFilter })
		.then(function(result) {
				console.log(result);
				if(result.length == 0) {
					result = { error : true, error_description : "No was filter was found for this ID" };
				}
			res.json(result);
		})
		.catch(function(err)
		{
			console.log(err);
		})
});

module.exports = router;