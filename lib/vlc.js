/*globals module,require*/
module.exports=(function(){
	var spawn=require('child_process').spawn;
	var proc,currentTrack;
	var play=function(url,id){
		if(typeof(proc)!=='undefined')
		{
			proc.kill();
		}
		proc=spawn("cvlc",[url]);
		this.currentTrack=id;
		console.log("Set id to "+this.currentTrack);
	};
	var _getCurrent=function(){
		console.log(this.currentTrack);
		return this.currentTrack;
	}
	return {
		play:play,
		getCurrent:_getCurrent
	}
})();
