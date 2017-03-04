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

exports.youtube = function(req, res) {
    var link = req.body.link;
    console.log(link);
    var callback = function(data) {
        console.log(res.send(200, data));
    };

    vlc.play(link, 'youtube', callback);
};

exports.youtubeInfo = function(req, res){
  var id = req.params.yid;
  res.send(vlc.getYoutubeInfo(id));
}

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

exports.control=function(req,res){
  res.render("control");
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

exports.volume = function(req, res) {
        var type = req.params.type;
        if (type == 'up') {
            vlc.volume('+10');
        } else if (type == 'down') {
            vlc.volume('-10');
        } else if (type == 'mute') {
            vlc.volume('0');
        } else if (type.substring(0, 4) == 'set=') {
            console.log(type.substring(4, type.length));
            vlc.volume(type.substring(4, type.length));
        } else {
            console.log("here");
        }
        res.send('ok');
    }
    //exports.pause=function(req,res){
    //  res.send(vlc.pause());
    //}

