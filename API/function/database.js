"use strict";
var pg = require('pg-promise')();
var SQLconfig = require('../../config/database.conf.js');
var client =  pg(SQLconfig);

module.exports =
{

	connect : function(sqlQuery,arrayParameters)
	{
		if(!arrayParameters) {
			arrayParameters = [];
		}

		console.log("Executing " + sqlQuery + " in database.js module");

		return client.query(sqlQuery,arrayParameters)
		.then(function(resultRow) {

			console.log("Result rows found :");
			console.log(resultRow);
			return resultRow;
		})
		.catch( function(err) {
			console.log("Fail to retrieve from the Database");
			console.log(err);
			return err;
		});
	}
};