exports.index = function(req, res){
  res.sendfile("index.html");
};
var vlc=require("../lib/vlc.js");

exports.play = function(req,res){
  //console.log("Playing https://music.sdslabs.co.in/"+req.body.url);
  vlc.play(req.body.url,req.body.id,0);
  res.send("Playing");
};
exports.current = function(req,res){
  res.send(vlc.getCurrent());
}

exports.youtube=function(req,res){
  var link=req.body.link;
  vlc.play(link,'youtube');
}

exports.kill=function(req,res){
  vlc.play('asd','asd',1);
  res.send("killed!");
}
//exports.pause=function(req,res){
//  res.send(vlc.pause());
//}