exports.index = function(req, res){
  res.sendfile("public/index.html");
};
var vlc=require("../lib/vlc.js");

exports.play = function(req,res){
  vlc.play(req.body.url,req.body.id);
  res.send("Playing");
};
exports.current = function(req,res){
  res.send(vlc.getCurrent());
};

exports.youtube=function(req,res){
  var link=req.body.link;
  vlc.play(link,'youtube');
};

exports.kill=function(req,res){
  vlc.kill();
  res.send("killed!");
};

exports.repeat = function(req,res){
  vlc.repeatCurrent();
};

exports.queuelist=function(req,res){
  res.sendfile("public/queue.html");
};

exports.list=function(req,res){
  var list = vlc.queuelist();
  res.send(list);
}

exports.recent = function(req,res){
  var recent = vlc.recentlist();
  res.send(recent);
}

exports.now = function(req,res){
  var now = vlc.rightnow();
  if(now==0){res.send(false);}
  else{res.send(true);}
}
//exports.pause=function(req,res){
//  res.send(vlc.pause());
//}
