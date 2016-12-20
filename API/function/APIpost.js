"use strict";
var database = require('../function/database');

module.exports =
{
	//Verify if an HTTP POST request has the the good parameters in it and insert the data into the database
	// @requiredParametersArray array of the parameters that are required ['name','firstname','town']
	// @HTTPRequestParameter Object of the HTTP request, often req.body
	// @SQLtable : The table to insert
	// @optionalParametersArray : Array of optional 
	// Return : JSON = response
	manageHTTP_POST : function(requiredParametersArray,HTTPRequestParameters,SQLtable,optionalParametersArray) {

		if(!requiredParametersArray || !HTTPRequestParameters || !SQLtable)
		{
			return { error : "COTOREP"}
		}

		if(!optionalParametersArray) {
			optionalParametersArray = []
		}
		var jsonResponse;
		//We verify that the HTTP Request has all the parameters we need
		for( var i = 0 ; i< requiredParametersArray.length ; i++ ) {
			if(!HTTPRequestParameters[requiredParametersArray[i]])
			{
				jsonResponse = { error : "The parameter : " + requiredParametersArray[i] + " was not supplied" };
				return jsonResponse;
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
		var setOfPreparedQueryParameters = "(";
		var setOfParameters = "(";
		var parametersValue = [];
		
		for(var i = 0 ; i < parametersArray.length ; i++ ) {

			var parameter = parametersArray[i];
			parametersValue.push(HTTPRequestParameters[parameter]);
			if( i+1 == parametersArray.length ) {//If it's the last parameter we close the paranthesis
				setOfParameters = setOfParameters + parameter + ")";
				setOfPreparedQueryParameters = setOfPreparedQueryParameters + "$" + (i+1) + ")";
			}

			else {				
				setOfParameters = setOfParameters + parameter + ",";
				setOfPreparedQueryParameters = setOfPreparedQueryParameters + "$" + (i+1) + ",";
			}
		}

		//We insert the data in the database
		var query = "INSERT INTO " + SQLtable + " " + setOfParameters + " VALUES " + setOfPreparedQueryParameters + " returning *";
		console.log(query)

		database.connect(query, function(err, result) {
			if(err) {
				return ({error:true});
			}
			else {
				return (result.rows);	
			}
		}, parametersValue);

	}


};