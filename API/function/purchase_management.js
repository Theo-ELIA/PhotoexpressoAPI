"use strict";
var database = require('../function/database');
var APIpost = require('../function/APIpost');


module.exports =
{
	order_exist : function(customer_id)
	{
		//On regarde si l'utilisateur a une commande en cours de validation
		var  query_orders = "SELECT ph_id as id FROM purchases.current_orders WHERE c_id = $1";

		var check_current_orders_promise = database.connect(query_orders, customer_id);

		return check_current_orders_promise.then(function(result)
		{
			if (result && result.length > 0)
			{
				console.log("LOG PURCHASE SELECT MANAGEMENT " +result[0].id);
				return result[0].id;
			}
			else
			{
				var create_command = APIpost.manageHTTP_POST(["customer_id"],{customer_id : customer_id },"purchases.purchase_historic");
				return create_command.then(function(purchase_id)
				{
					console.log("LOG PURCHASE INSERT MANAGEMENT " +purchase_id[0].id);
					return purchase_id[0].id;
				});


			}
		});
	}
};