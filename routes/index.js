exports.index = function(req, res){
  res.render("index");
};
var vlc=require("../lib/mplayer.js");
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
  var ip = req.ip;
  var valid = ipClass.testIP(ip);
  if(valid == true){
    next();
  } else {
    res.send(403,'Only lab members from lab can play songs');
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

exports.togglepause = function(req, res) {
  var success = vlc.togglepause();
  res.send(success);
}

/**
 * JSON endpoints
 */
exports.nowplaying = function(req, res) {
  var isPlaying = vlc.rightnow() == 0 ? false: true ;
  var trackId = vlc.getCurrent();

  res.send(JSON.stringify({
    playing: isPlaying,
    track: {
      id: trackId
    }
  }));
}

//exports.pause=function(req,res){
//  res.send(vlc.pause());
//}
