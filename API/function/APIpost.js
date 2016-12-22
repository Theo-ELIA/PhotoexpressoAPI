"use strict";
var database = require('../function/database');

module.exports =
{
	//Verify if an HTTP POST request has the the good parameters in it and insert or update it the data into the database
	// @requiredParametersArray array of the parameters that are required ['name','firstname','town']
	// @HTTPRequestParameter Object of the HTTP request, often req.body
	// @SQLtable : The table to insert
	// @optionalParametersArray : Array of optional
	// @objIdUpdate : Object : If the ID was provided, update the table instead of inserting a row format {id_name : "id_foo", id_to_update : 5}
	// Return : Promise = Promise
	// Example for Insert	apipost.manageHTTP_POST(["filter_name","filter_price"],{filter_name: "TooManyFilter",filter_price:2.34},"photo_options.filter",[]);
	//Example for update : apipost.manageHTTP_POST(["filter_name","filter_price"],{filter_name: "TooManyFilter",filter_price:2.34},"photo_options.filter",[],{id_name : "id", id_to_update : 6});

	manageHTTP_POST : function(requiredParametersArray,HTTPRequestParameters,SQLtable,optionalParametersArray,objIdUpdate) {

		var setOfPreparedQueryParameters; // For INSERT INTO statement VALUES($1,$2,$3,$4)
		var setOfParameters; // Array of parameters we will insert into or update
		var parametersValue = []; //Array of the value we will put into the database
		var query //SQL Query we're going to execute
		var jsonResponse

		if(!requiredParametersArray || !HTTPRequestParameters || !SQLtable)
		{
			throw { error : "COTOREP"}
		}

		if(objIdUpdate)
		{
			if(!objIdUpdate.id_name || !objIdUpdate.id_to_update)
			{
				throw { error : "The objIdUpdate prvided was incomplete"}
			}
		}

		if(!optionalParametersArray) {
			optionalParametersArray = []
		}

		//We verify that the HTTP Request has all the parameters we need
		for( var i = 0 ; i< requiredParametersArray.length ; i++ ) {
			if(!HTTPRequestParameters[requiredParametersArray[i]])
			{
				jsonResponse = "The parameter : " + requiredParametersArray[i] + " was not supplied";
				console.log("The parameter : " + requiredParametersArray[i] + " was not supplied");
				throw jsonResponse;
			}
		}

		//For each optional parameter array we set to null if the parameter wasn't supplied
		for(var i = 0 ; i < optionalParametersArray; i++ ) {
			if(!HTTPRequestParameters[optionalParametersArray[i]])
			{
				HTTPRequestParameters[optionalParametersArray[i]] == "NULL";
			}
		}

		var parametersArray = requiredParametersArray.concat(optionalParametersArray);

		//If we are there we have the correct parameters
		//We create the query


		if(objIdUpdate) {
			setOfPreparedQueryParameters = ""
		}

		else {
			setOfPreparedQueryParameters = "(";
			setOfParameters = "(";
		}

		for(var i = 0 ; i < parametersArray.length ; i++ ) {

			var parameter = parametersArray[i];
			parametersValue.push(HTTPRequestParameters[parameter]);
			if( i+1 == parametersArray.length ) {//If it's the last parameter we close the paranthesis

				if(objIdUpdate) {
					setOfPreparedQueryParameters = setOfPreparedQueryParameters + parameter + "=$" + (i+1);
				}

				else {
					setOfParameters = setOfParameters + parameter + ")";
					setOfPreparedQueryParameters = setOfPreparedQueryParameters + "$" + (i+1) + ")";
				}
			}

			else {

				if(objIdUpdate) {
					setOfPreparedQueryParameters = setOfPreparedQueryParameters + parameter + "=" + "$" + (i+1)  + ",";
				}

				else {
					setOfParameters = setOfParameters + parameter + ",";
					setOfPreparedQueryParameters = setOfPreparedQueryParameters + "$" + (i+1) + ",";
				}
			}
		}

		//We insert the data in the database
		if(objIdUpdate) {
			query = "UPDATE " + SQLtable + " " + "SET " + setOfPreparedQueryParameters + " WHERE " + objIdUpdate.id_name + "=" + objIdUpdate.id_to_update + " returning *"
		}
		else {
			query = "INSERT INTO " + SQLtable + " " + setOfParameters + " VALUES " + setOfPreparedQueryParameters + " returning *";
		}

		console.log("API Post = " + query)

		var promise = database.connect( query, parametersValue );

		return promise.then(function(result) {
			console.log("Returning a promise POST")
			console.dir(result);
			return result;
		})
		.catch(function(err) {
			console.log("Error " + err)
			throw(err);
		})

}

};