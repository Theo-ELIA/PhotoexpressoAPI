"use strict";
var pg = require('pg-promise')();
//Take a callback function and a SQL query

var SQLconfig =  {
	user: 'admin',
	database: 'photoexpresso',
	password: 'admin',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,
};

var client =  pg(SQLconfig);

module.exports =
{

	connect : function(sqlQuery,arrayParameters)
	{
		if(!arrayParameters) {
			arrayParameters = [];
		}

		var promise = client.query(sqlQuery,arrayParameters);
		promise.catch( function(err) {
			console.log("Fail to retrieve from the Database")
			console.log(err);
			res.json(err);
		});

		return promise;
	}
}