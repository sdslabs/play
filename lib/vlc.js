/*globals module,require*/
module.exports=(function(){
        var spawn=require('child_process').spawn
        var proc
            ,currentTrack
            ,to_recent
            ,currentTrackData = [] //To store id and url of current track
            ,queue = []
            ,recent = [] // to store recent played songs
            ,playing=0
            ,now=0;
        var play=function(url,id){
    		if (!playing){
          currentTrackData[0] = url;
          currentTrackData[1] = id;
    			playing = 1;
          now = playing;
      		// youtube link
      		// because, otherwise it will add 'youtube' in the '/list' or '/recent' or '/current' :|
		      if(id == 'youtube')
		      {
		        if(url.indexOf('?v=') != -1)
		        {
		          a = url.indexOf('?v=');
		          key = '';
		          for(var i=a+3;i<a+14;i++)
		          {key = key + url[i];}
		          //console.log(key);

		          to_recent = key;         // currentTrack, which is gonna add to recent
		          currentTrack = [key];
		        }
		        else if(url.indexOf('&v=') != -1)
		        {
		          a = url.indexOf('&v=');
		          key = '';
		          for(var i=a+3;i<a+14;i++)
		          {key = key + url[i];}

		          to_recent = key;
		          currentTrack = [key];
		        }
		        // wrong youtube link : error log
		        else
		        {
		          console.log('youtube link was not right');
		        }
		      }
		      // muzi link
		      else
		      {
		        currentTrack = [id];
		        to_recent = id;
		      }

		      if(typeof(proc)!=='undefined'){
		        proc.kill();
		      }
		      proc=spawn("cvlc",[url]);
		      proc.on('exit',queuefunc);
		    }

    		else {
		      var entry = [];
		      entry[0] = url;
		      entry[1] = id;
		      queue.push(entry);}
  			}

        var repeatCurrent = function(){
          if(currentTrackData.length>0)
          {
            queue.unshift(currentTrackData);
            currentTrackData = [];
            return true;
          }
          else
          {
            return false;
          }

        }

			  var kill=function(){
			    proc.kill();
          queuefunc();
			  }

        var queuefunc=function(){
          playing = 0;
          now = playing;
          // for recent
          x = [];
          x.push(to_recent);
          l = recent.length;
          // showing recent 5 songs only
          if(l>0)
          {
                if(l>=5)
                {
                        for(var a=0;a<4;a++)
                        {x.push(recent[a]);}
                }
                else
                {
                        for(var a=0;a<l;a++)
                        {x.push(recent[a]);}
                }
          }
          recent = x;
          //
    			if (typeof queue[0] !== 'undefined'){
            play(queue[0][0],queue[0][1]);
            queue.shift();
          }
        }

        var queuelist=function(){
                return queue;
        }

        var recentlist = function(){
                return recent;
        }

        var _getCurrent=function(){
                return currentTrack;
        }
        var rightnow = function(){
		            return now;
        }

        return {
                play:play,
                getCurrent:_getCurrent,
                queuelist:queuelist,
                kill:kill,
                recentlist:recentlist,
		            rightnow:rightnow,
                repeatCurrent: repeatCurrent,
        }
})();
