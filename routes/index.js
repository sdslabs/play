exports.index = function(req, res){
  res.render("index");
};
var vlc=require("../lib/vlc.js");
var ipClass = require("../lib/iptest.js");

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

exports.checkIp = function(req, res, next ){
  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  var valid = ipClass.testIP(ip);
  if(valid == true){
    next();
  } else {
    res.status(403).send();
  }
}

exports.kill=function(req,res){
  vlc.kill();
  res.send("killed!");
};

exports.repeat = function(req,res){
  res.send(vlc.repeatCurrent());
};

exports.queuelist=function(req,res){
  res.render("queue");
};

exports.list=function(req,res){
  var list = vlc.queuelist();
  res.send(list);
}

exports.recent = function(req,res){
  var recent = vlc.recentlist();
  res.send(recent);
}

exports.next = function (req, res) {
  res.send(vlc.getNext());
}

exports.now = function(req,res){
  var now = vlc.rightnow();
  if(now==0){res.send(false);}
  else{res.send(true);}
}
//exports.pause=function(req,res){
//  res.send(vlc.pause());
//}
