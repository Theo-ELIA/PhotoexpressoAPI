"use strict";
var pg = require('pg');
//Take a callback function and a SQL query
module.exports =
{

	connect : function(sqlQuery,callback)
	{
		var pool = new pg.Pool(global.SQLconfig);
		pool.connect(function(err, client, done) {

		  if(err) {
		    return console.error('error fetching client from pool', err);
		  }

		  client.query(sqlQuery,function(err, result) {
			    //call `done()` to release the client back to the pool 
			    done();
			 
			    if(err) {
			    	console.error('error runnin SQL Query :'+ sqlQuery, err);
			    }
			    callback(err,result);
	  	});
	});

		pool.on('error', function (err, client) {
			// if an error is encountered by a client while it sits idle in the pool 
			// the pool itself will emit an error event with both the error and 
			// the client which emitted the original error 
			// this is a rare occurrence but can happen if there is a network partition 
			// between your application and the database, the database restarts, etc. 
			// and so you might want to handle it and at least log it out 
			console.error('idle client error', err.message, err.stack)
		})
		
	}

}