module.exports =(function(){
	var testIp = function( ipAddress ){
		var sds = '192.168.208',i, valid = true;
		for(i=0;i<11;i++){
			if(ipAddress[i] != sds[i] ){
				valid  = false;
				break;
			}
		}
		return valid;
	};

	return {testIP : testIp};
})();