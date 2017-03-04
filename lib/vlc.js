/*globals module,require*/
var json = require('../public/config.json');
module.exports = (function() {
  var spawn = require('child_process').spawn
  var proc, currentTrack, to_recent, currentTrackData = [] //To store id and url of current track
    ,
    queue = [],
    recent = [] // to store recent played songs
    ,
    playing = 0,
    now = 0;
  var youtubeData = {};
  var play = function(url, id) {
    if (!playing) {
      currentTrackData[0] = url;
      currentTrackData[1] = id;
      playing = 1;
      now = playing;
      // youtube link
      // because, otherwise it will add 'youtube' in the '/list' or '/recent' or '/current' :|
      if (id == 'youtube') {
        if (url.indexOf('?v=') != -1 || url.indexOf('&v=') != -1) {
          if(url.indexOf('?list=') != -1 || url.indexOf('&list=') != -1){
            urls=url.split("&list=");
            url=urls[0];
          }
          var yid = parseYoutubeId(url);
          if (typeof(proc) !== 'undefined') {
            proc.kill();
          }

          // Spawning link to the track
          var child = spawn("youtube-dl", ["-g", url]);
          var link = "";
          child.stdout.on('data', function(data) {
            link = link + data;
          });
          child.stderr.on('data', function(data) {
            console.log('youtube-dl stderr: ' + data);
          });
          child.on('close', function(code) {
            var links = link.split('\n');
            var first_link = links[0];
            if (!youtubeData[yid])
              setYoutubeInfo(url);
            if(json.env_OS=="linux"){
              proc = spawn("vlc", [ "--play-and-exit", first_link]);
            }
              else{
            proc = spawn("vlc", ["-Incurse", "--vout", "none", "--play-and-exit", first_link]);
          }
            proc.on('exit', queuefunc);
          });
          currentTrack = [yid];
          to_recent = yid;
        }
        else{
          if (url.indexOf('?list=') != -1 || url.indexOf('&list=') != -1) {
            console.log("inlist");
            if(typeof(proc)!=='undefined'){
              proc.kill();
            }
            playing=0;
            now=0;
            var link="",first_link;
            var child=spawn("youtube-dl",["--get-id",url]);
            child.stdout.on('data', function(data) {
              link+=data;
            });
            child.stderr.on('data', function(data) {
              console.log('youtube-dl stderr: ' + data);
            });
            child.on('close', function(code) {
              var links = link.split("\n");
              for(var i=0;i<links.length-1;i++){
                links[i]="https://www.youtube.com/watch?v="+links[i];
                if(i==0){
                  first_link=links[i]
                }
                else{
                  var entry = [];
                  entry[0] = links[i];
                  entry[1] = id;
                  queue.push(entry);
                  if (id == 'youtube') {
                    if (links[i].indexOf('?v=') != -1 || links[i].indexOf('&v=') != -1) {
                      if (!youtubeData[parseYoutubeId(links[i])])
                        setYoutubeInfo(links[i]);
                    }
                  }
                }
              }
              play(first_link,'youtube');
            });
          }
        }
      }
      // muzi link
      else {
        currentTrack = [id];
        to_recent = id;
          if(json.env=="linux"){
              proc = spawn("vlc", [ "--play-and-exit", url]);
            }
              else{
            proc = spawn("vlc", ["-Incurse", "--vout", "none", "--play-and-exit", url]);
          }
                  proc.on('exit', queuefunc);
      }
    }
    else {
      if (url.indexOf('?v=') != -1 || url.indexOf('&v=') != -1){
        if(url.indexOf('?list=') != -1 || url.indexOf('&list=') != -1){
          urls=url.split("&list=");
          url=urls[0];
        }
        var entry = [];
        entry[0] = url;
        entry[1] = id;
        queue.push(entry);
        if (id == 'youtube') {
          if (url.indexOf('?v=') != -1 || url.indexOf('&v=') != -1) {
            if (!youtubeData[parseYoutubeId(url)])
              setYoutubeInfo(url);
          }
        }
      }
      else{
        if (url.indexOf('?list=') != -1 || url.indexOf('&list=') != -1){
        var link="";
        var child=spawn("youtube-dl",["--get-id",url]);
        child.stdout.on('data', function(data) {
           link+=data;
        });
         child.stderr.on('data', function(data) {
           console.log('youtube-dl stderr: ' + data);
         });
         child.on('close', function(code) {
           var links = link.split("\n");
           for(var i=0;i<links.length-1;i++){
             links[i]="https://www.youtube.com/watch?v="+links[i];
             var entry = [];
             entry[0] = links[i];
             entry[1] = id;
             queue.push(entry);
             if (id == 'youtube') {
               if (links[i].indexOf('?v=') != -1 || links[i].indexOf('&v=') != -1) {
                 if (!youtubeData[parseYoutubeId(links[i])])
                   setYoutubeInfo(links[i]);
               }
             }
            }
          });
        }
      }
    }
  }

  var repeatCurrent = function() {
    if (currentTrackData.length > 0) {
      queue.unshift(currentTrackData);
      currentTrackData = [];
      return true;
    } else {
      return false;
    }
  }

  var kill = function() {
    proc.kill();
  }

  var getNext = function() {
    if (queue.length > 0) {
      return [queue[0][1]];
    } else
      return null;
  }

  var parseYoutubeId = function(url) {
    var key = '';
    if (url.indexOf('?v=') != -1) {
      a = url.indexOf('?v=');
      for (var i = a + 3; i < a + 14; i++) {
        key = key + url[i];
      }
    } else if (url.indexOf('&v=') != -1) {
      a = url.indexOf('&v=');
      for (var i = a + 3; i < a + 14; i++) {
        key = key + url[i];
      }
    }
    return key;
  }

  var setYoutubeInfo = function(url) {
    var info = "";
    var child = spawn("youtube-dl", ["-j", url]);
    child.stdout.on('data', function(data) {
      info = info + data;
    })
    child.on('close', function() {
      info = JSON.parse(info);
      yid = info.id;
      youtubeData[yid] = {
        'data': {
          'title': info.title,
          'uploader': info.uploader,
          'thumbnail': info.thumbnail
        }
      };
    })
  }

  var queuefunc = function() {
    console.log('Queuing...');
    playing = 0;
    now = playing;
    // for recent
    x = [];
    x.push(to_recent);
    l = recent.length;
    // showing recent 5 songs only
    if (l > 0) {
      if (l >= 5) {
        for (var a = 0; a < 4; a++) {
          x.push(recent[a]);
        }
      } else {
        for (var a = 0; a < l; a++) {
          x.push(recent[a]);
        }
      }
    }
    recent = x;
    //
    if (typeof queue[0] !== 'undefined') {
      play(queue[0][0], queue[0][1]);
      queue.shift();
    }
  }

  var queuelist = function() {
    return queue;
  }

  var recentlist = function() {
    return recent;
  }

  var _getCurrent = function() {
    return currentTrack;
  }
  var rightnow = function() {
    return now;
  }

  var getYoutubeInfo = function(id) {
    return youtubeData[id];
  }

  var volume = function(change) {
    if(json.env_OS=="linux")
    {
      change=change +"%";
      if(change == '0') {
      var child = spawn("pactl",[ "--","set-sink-volume","0","0%"] );
          }
    else {
      var child = spawn("pactl",[ "--","set-sink-volume","0",change] );
    }
    }
    else{if(change == '0') {
      var child = spawn("nircmd.exe", ["mutesysvolume", "2"]);
    }
    else {
      change=change*65535/100;
      var child = spawn("nircmd.exe", ["setsysvolume", change]);
    }}
  }

  return {
    play: play,
    getCurrent: _getCurrent,
    queuelist: queuelist,
    kill: kill,
    recentlist: recentlist,
    rightnow: rightnow,
    repeatCurrent: repeatCurrent,
    getNext: getNext,
    getYoutubeInfo: getYoutubeInfo,
    volume: volume
  }
})();
