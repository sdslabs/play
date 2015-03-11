var config = require('../config/config.js');

module.exports =(function(){
	var testIp = function( ipAddress ){
		var allowedPrefix = config.allowedIpPrefix, valid = true;
    ipAddress = ipAddress.split('.');
    ipAddress.pop();
    ipFirst3Bytes = ipAddress.join('.');

		if( ipFirst3Bytes != allowedPrefix){
			valid = false;
		}

		return valid;
	};

	return {testIP : testIp};
})();