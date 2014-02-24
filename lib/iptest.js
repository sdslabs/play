module.exports =(function(){
	var testIp = function( ipAddress ){
		var sds = '192.168.208', valid = true;
		//Comment below 3 for development
		if( ipAddress.substr(0,11) != sds){
			valid = false;
		}
		return valid;
	};

	return {testIP : testIp};
})();