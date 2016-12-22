"use strict";
var express = require('express');
var jwt = require('jsonwebtoken');
var database = require('../function/database');

//We import the files we need
var router = express.Router() //This variable represent the routing of our application



router.get('/',function(req,res){
	res.send('Welcome to photoOption API')
})

/*Format */
router.get('/listFormats',function(req,res)
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

});

/*Filters*/
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
	res.json(APIpost.manageHTTP_POST(['filter_id'],req.body,"photo_options.filter"));
});

module.exports = router;