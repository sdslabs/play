/*globals module,require*/
module.exports=(function(){
	var spawn=require('child_process').spawn;
	var proc;
	var play=function(url){
		if(typeof(proc)!=='undefined')
		{
			proc.kill();
		}
		proc=spawn("cvlc",["--volume 80",url,]);
	};
	return {
		play:play
	}
})();