/*globals module,require*/
module.exports=(function(){
	var spawn=require('child_process').spawn;
	var proc,currentTrack;
  var playing = 0;
  var queue = [];
	var play=function(url,id,kill){
	if (!kill) {
    console.log(playing);
    if (playing == 0){
      playing = 1; 
      if(typeof(proc)!=='undefined'){
        proc.kill();
      }
      proc=spawn("cvlc",[url]);
    }
    else {
      var entry = [];
      entry[0] = [url];
      entry[1] = [id];
      queue.push(entry);
      console.log('queue='+queue);
    }
    proc.on('exit', function(){
      playing = 0;
      if (typeof queue[0] !== 'undefined'){
        play(queue[0][0],queue[0][1],0);
        queue.shift();
      }
      console.log('its over');
    });
    this.currentTrack=id;
    console.log("Set id to "+this.currentTrack);
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
