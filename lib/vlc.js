/*globals module,require*/
module.exports=(function(){
	var spawn=require('child_process').spawn;
	var proc,currentTrack;
  var queue = [];
  var playing=0;
	var play=function(url,id,kill){
		if (!kill) {
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
	    }
	    this.currentTrack=id;
	    //console.log("Set id to "+this.currentTrack);
		}
		if (kill){
      this.proc.kill();
    }
  }
	
	var queuefunc=function(){	
	  playing = 0;
    if (typeof queue[0] !== 'undefined'){
	  	play(queue[0][0],queue[0][1],0);
	    queue.shift();
	  }
	}

	var _getCurrent=function(){
		console.log(this.currentTrack);
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
