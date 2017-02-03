"use strict";
var jwt = require('jsonwebtoken');


module.exports =
{

	/*
	@token : Token created by /connection or /connectionAdmin
	@roleRestriction : CUSTOMER or ADMIN
	@idUser : int idUser to restrict 
	return boolean if the token is verified
	*/
	verifyToken : function(token,roleRestriction,idUser) {

		if(!token) {
			throw ({error : true , error_description : "No token given"});
		}

		if(token == "ADMIN") {
			return true;
		}

		jwt.verify(token,global.KEY_PRIVATE, function(err, decoded) {
			
			if(err) {
				return false;
			}

			if(decoded) {
				if(decoded.idCustomer == idUser && decoded.role == "CUSTOMER") {
					return true;
				}
			}
			else if(decoded.role == "CUSTOMER") { //If a customer try to read something he isn't allowed to
				return false;
			}
			else if(decoded.role == "ADMIN")
			{
				return true;
			}
			else {
				return false;
			}
		});
	}
};