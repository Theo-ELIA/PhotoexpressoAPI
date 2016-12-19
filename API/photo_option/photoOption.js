"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');


//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to photoOption API')
})

router.get('/listFilters',function(req,res)
{
	var query = "SELECT * FROM photo_options.filter";
	database.connect(query, function(err, result) {
		if(err)
		{
			res.json({error:true});
		}
		else {
			res.json(result.rows);
		}
	}
)});

router.get('/',function(req,res){

})

router.get('/listFormat',function(req,res)
{
	var query = "SELECT * FROM format";
	database.connect(query, function(err, result) {
		if(err) {
			res.json({error:true});
		}
		else {
			res.json(result.rows);
		}
	});
});


router.get('/listFormatAvailable',function(req,res)
{
	var query = "SELECT * FROM photo_options.format";
	database.connect(query, function(err,result) {
		if(err) {
			res.json({error:true});
		}
		else {
			res.json(result.rows);
		}
	});
});

router.post('/formatAdd', function(req, res)
{
	if(!req.params._name || !req.params.format_price)
	{
		var query = "INSERT INTO format (format_name, format_price) VALUES ($1,$2)";
		database.connect(query, function(err,result) {
			if(err)
			{
				res.json({error:true});
			}
			res.json(result.rows);
		}, [req.params.format_name,req.params.format_price]);
	}
	else
	{
		res.json({error:true,error_msg:"Suffisent parameters weren't not supplied"})
	}
});

router.post('/filterAdd',function(req,res)
{
	var query = "INSERT INTO photo_options.filter (filter_name, filter_price) VALUES ( $1 , $2 )";
	database.connect(query, function(err,result) {
		if(err) {
			res.json({error:true});
		}
		else {
			res.json(result.rows);
		}
	},[req.params.filter_name,req.params.filter_price]);
});

module.exports = router;