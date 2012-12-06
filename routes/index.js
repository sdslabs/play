exports.index = function(req, res){
  res.sendfile("index.html");
};
var vlc=require("../lib/vlc.js");

exports.play = function(req,res){
	console.log("Playing https://music.sdslabs.co.in/"+req.body.url);
	vlc.play("https://music.sdslabs.co.in/"+req.body.url,req.body.id);
	res.send("Playing");
};
exports.current = function(req,res){
	res.send(vlc.getCurrent());
}