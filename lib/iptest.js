module.exports =(function(){
	var testIp = function( ipAddress ){
		var sds = '192.168.208',i, valid = true;
		if( ipAddress.substr(0,10) != sds){
			valid = false;
		}
		return valid;
	};

	return {testIP : testIp};
})();