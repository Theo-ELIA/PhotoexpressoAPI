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
	var query = "SELECT * FROM filter";
	database.connect(query, function(err, result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	}
)});

router.get('/',function(req,res){

})

router.get('/listFormat',function(req,res)
{
	var query = "SELECT * FROM format";
	database.connect(query, function(err, result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	});
});


router.get('/listFormatAvailable',function(req,res)
{
	var query = "SELECT * FROM format";
	database.connect(query, function(err,result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	});
});

router.post('/formatAdd', function(req, res)
{
	var newFormat = [];
	var query = "INSERT INTO format (format_name, format_price) VALUES $1";
	database.connect(query, function(err,result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	}, newFormat);
});

module.exports = router;