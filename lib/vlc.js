/*globals module,require*/
module.exports=(function(){
	var spawn=require('child_process').spawn;
	var proc,currentTrack;
	var to_recent;
  var queue = [];
  var recent = []; // to store recent played songs
  var playing=0;
	var play=function(url,id){
    if (!playing){
	    currentTrack=[id];
	    to_recent = id; // currentTrack, which is gonna add to recent
      playing = 1;
      if(typeof(proc)!=='undefined'){
        proc.kill();
      }
      proc=spawn("cvlc",[url]);
  		proc.on('exit',queuefunc);
    }
    else {
      var entry = [];
      entry[0] = url;
      entry[1] = id;
      queue.push(entry);
    }
    //console.log("Set id to "+currentTrack);
  }

  var kill=function(){
    proc.kill();
  	//console.log(proc);
  }
	
	var queuefunc=function(){	
	  playing = 0;
	  // for recent
	  x = [];
	  x.push(to_recent);
	  l = recent.length;
	  // showing recent 5 songs only
	  if(l>0)
	  {
		if(l>=5)
		{
			for(var a=0;a<4;a++)
			{x.push(recent[a]);}	
		}
		else
		{
			for(var a=0;a<l;a++)
			{x.push(recent[a]);}
		}
          }
	  recent = x;
          //
    if (typeof queue[0] !== 'undefined'){
	  	play(queue[0][0],queue[0][1]);
	    queue.shift();
	  }
	}

	var queuelist=function(){
		return queue;
	}

	var recentlist = function(){
		return recent;
	}

	var _getCurrent=function(){
	  console.log(currentTrack);
		return currentTrack;
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
		queuelist:queuelist,
		kill:kill,
		recentlist:recentlist
		// pause:pause
	}
})();

