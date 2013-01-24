/*globals module,require*/
module.exports=(function(){
	var spawn=require('child_process').spawn;
	var proc,currentTrack;
  var queue = [];
  var playing=0;
	var play=function(url,id,kill){
		if (!kill) {
			console.log(playing);
	    if (!playing){
	      playing = 1;
	      if(typeof(proc)!=='undefined'){
	        this.proc.kill();
	      }
	      this.proc=spawn("cvlc",[url]);
    		this.proc.on('exit',queuefunc);
	    }
	    else {
	      var entry = [];
	      entry[0] = [url];
	      entry[1] = [id];
	      queue.push(entry);
	      console.log('queue='+queue);
	    }
	    this.currentTrack=id;
	    //console.log("Set id to "+this.currentTrack);
		}
		if (kill){
      this.proc.kill();
    }
  }
	
	var queuefunc=function(){	
  	console.log('its over');
    if (typeof queue[0] !== 'undefined'){
	  	this.proc=spawn("cvlc",queue[0][0]);
  		this.proc.on('exit',queuefunc);
	    queue.shift();
	    playing = 0;
	  }
  	console.log('queue check '+queue);
	}

	var _getCurrent=function(){
		this.proc.kill();
		return this.currentTrack;
	}
	// var pause=function(){
		// var dbus = require('dbus-native');
		// conn.message({
		//     path:'/org/mpris/MediaPlayer2',
		//     destination: 'org.mpris.MediaPlayer2.vlc',
		//     'interface': 'org.mpris.MediaPlayer2.Player.Pause',
		//     type: dbus.messageType.methodCall
		// });
		// conn.on('message', function(msg) { console.log(msg); });		

		// var sys = require('sys')
		// var exec = require('child_process').exec;
		// function puts(error, stdout, stderr) { sys.puts(stdout) }
		// exec("dbus-send --session --type=method_call --print-reply --dest=org.mpris.MediaPlayer2.vlc /org/mpris/MediaPlayer2 org.mpris.MediaPlayer2.Player.Pause", puts);
	// }
	return {
		play:play,
		getCurrent:_getCurrent,
		// pause:pause
	}
})();
