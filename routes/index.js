exports.index = function(req, res){
  res.render("index");
};

var request = require('request');

var vlc = require("../lib/mplayer.js");
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
  var isPlaying = vlc.rightnow() == 0 ? false: true;
  var isPaused = vlc.isPaused();
  var action = null;
  var success = false;

  if(isPlaying) {

    if(isPaused) {
      success = vlc.togglepause();

      if(success) {
        action = 'resumed';
      }
    } else {
      success = vlc.togglepause();

      if(success) {
        action = 'paused';
      }

    }
  }

  sendJSONResponse(res, {success: success, action: action});
}

/**
 * JSON endpoints
 */
exports.nowplaying = function(req, res) {
  var isPlaying = vlc.rightnow() == 0 ? false: true;
  var trackId = null;
  var title = null;
  var artist_name = null;
  var artist_pic = null;

  if(isPlaying) {
    var trackId = vlc.getCurrent()[0];

    var trackInfoUrl = "https://howl.sdslabs.co.in/track/info/";

    request(trackInfoUrl + trackId, function(error, response, body) {
      if( ! error && response.statusCode == 200) {
        var jsonResponse = JSON.parse(body);

        title = jsonResponse.title;
        artist_name = jsonResponse.artist;
        artist_pic = "https://cdn.sdslabs.co.in/music_pics/" + jsonResponse.album_id + ".jpg";

        sendJSONResponse(res, {
          playing: isPlaying,
          track: {
            id: trackId,
            title: title,
            artist: artist_name,
            artist_pic: artist_pic
          }
        });
      }
    });
  } else {
    sendJSONResponse(res, {
          playing: isPlaying,
          track: null
        });
  }

}

var sendJSONResponse = function(res, data) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data));
};

//exports.pause=function(req,res){
//  res.send(vlc.pause());
//}
