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
	var query = "SELECT * FROM photo_options.format";
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

router.post('/formatAdd', function(req, res)
{
	var query = "INSERT INTO photo_options.format (format_name, format_price) VALUES ($1,$2)";
	database.connect(query, function(err,result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	}, [req.param.format_name,req.param.format_price]);
});

router.get('/filterAdd',function(req,res)
{
	var query = "INSERT INTO photo_options.filter (filter_name, filter_price) VALUES ( $1 , $2 )";
	database.connect(query, function(err,result) {
		if(err) {
			res.json({error:true});
		}
		else {
			res.json(result.rows);
		}
	},[req.param.filter_name,req.param.filter_price]);
});

router.post('/addIncompatibility', function(req, res)
{
	var query = "INSERT INTO photo_options.incompatibility (id_filter, id_format) VALUES ($1, $2)";
	database.connect(query, function(err,result) {
		if(err)
		{
			res.json({error:true});
		}
		res.json(result.rows);
	}, [req.param.filter_id,req.param.format_id]);
});

module.exports = router;