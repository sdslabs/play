/*globals module,require*/
module.exports=(function(){
	var spawn=require('child_process').spawn;
	var proc,currentTrack;
	var play=function(url,id){
		// if(typeof(proc)!=='undefined')
		// {
		// 	proc.kill();
		// }
		proc=spawn("cvlc",[url]);
		this.currentTrack=id;
		console.log("Set id to "+this.currentTrack);
	};
	var _getCurrent=function(){
		console.log(this.currentTrack);
		return this.currentTrack;
	}
	var pause=function(){
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
	}
	return {
		play:play,
		getCurrent:_getCurrent,
		pause:pause
	}
})();
