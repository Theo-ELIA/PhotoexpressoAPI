"use strict";
var database = require('../function/database');

module.exports =
{
	/*
	@objIdToSelect : JSON of the ids to select from - format { id_food : 1, id_bar : 17} will make WHERE id_food = 
	*/
	manageHTTP_GET : function(requiredParametersArray,SQLtable,objIdToSelect) {

		var setOfParameters = "" //Set of the parameters to select
		var setOfSelectingId = ""
		var query;
		if(!requiredParametersArray || !SQLtable)
		{
			throw { error : "COTOREP"}
		}

		for( var i = 0; i < requiredParametersArray.length;i++) {

			var parameter = requiredParametersArray[i];
			console.log(requiredParametersArray.lastIndexOf(parameter))
			if ( i+1 == requiredParametersArray.length ) {
				setOfParameters = setOfParameters + parameter + " "
			}
			else {
				setOfParameters = setOfParameters + parameter + ","
			}
		}

		if(objIdToSelect) {
			for (var i = 0; i< Object.keys(objIdToSelect).length;i++) {
				
				if(i==0) {
					setOfSelectingId = setOfSelectingId + "WHERE ";
				}
				else {
					setOfSelectingId = setOfSelectingId + "AND ";
				}

				setOfSelectingId = setOfSelectingId + Object.keys(objIdToSelect)[i] + "=";
				if(typeof(objIdToSelect[Object.keys(objIdToSelect)[i]]) == "string") {
					setOfSelectingId = setOfSelectingId + "\"" + objIdToSelect[Object.keys(objIdToSelect)[i]] + "\"";  
				}
				else {
					setOfSelectingId = setOfSelectingId + objIdToSelect[Object.keys(objIdToSelect)[i]] + " ";
				}
			}
		}
		
		var query = "SELECT " + setOfParameters + " FROM " + SQLtable + " " + setOfSelectingId;
		console.log(query)


		var promise = database.connect( query );

		promise.then(function(result) {
			if(global.isDebugMode) {
				console.log(result);
				return promise
			}

		})
		.catch(function(err) {
			console.log(err)
			return promise
		});

	}
}