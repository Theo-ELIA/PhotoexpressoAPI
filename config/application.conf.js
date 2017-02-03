"use strict";

var applicationConfiguration = {
	debug : {
		port : 8080,
		loggingLevel : 'debug'
	},
	production : {
		port : 80,
		loggingLevel : 'warning'
	},
	default : {
		listening_interface : "0.0.0.0"
	}
};
// Crée une configuration à partir du mode (debug|production) et le complète éventuellement avec les valeurs par défaut
var getConfiguration = function(runningMode) {

	var configurationToReturn = {};

	if( runningMode === "default" ) {
		return configurationToReturn;
	}
	else if( Object.keys(applicationConfiguration).includes(runningMode) ) {
		configurationToReturn = applicationConfiguration[runningMode];

		//Check all parameter that's not in the RunningMode but in default
		var parametersToAdd = Object.keys(applicationConfiguration['default']).filter(function(n) {
			return Object.keys(configurationToReturn).indexOf(n) === -1;
		});

		//Then we add the default parameter
		parametersToAdd.forEach(function (paramater) {
			configurationToReturn[paramater] = applicationConfiguration['default'][paramater];
		});
	}

	return configurationToReturn;
};

module.exports = { getConfiguration };