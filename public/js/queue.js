(function($, play){


    function Queue(){
      this.config = null;
      holi=this;
    };

    var QP = Queue.prototype;

    QP.checkLocation = function(){
      if(window.location.pathname == "/queue")
        return true;
      else
        return false;
    };

    QP.to403 = function( s, msg, e ){
      if( e == 'Forbidden' )
        alert('Only lab member from inside lab can play songs');
    };

    QP.showTooltip = function(obj, value, pos){
    obj.attr("data-hint",""+value+"");
    obj.addClass("hint--"+top+" hint--bounce");
    };

    QP.removeTooltip = function(obj, pos){
      obj.mouseleave(function(){
          obj.removeClass("hint--"+pos);
          obj.removeAttr("data-hint");
        });
    };

    QP.initialize = function(){
      if(this.checkLocation()){
        this.killHandler();
        this.getNowPlaying();
        this.getQueue();
        this.getRecent();
        this.addClickEvents();
      }
    };

    QP.getYoutubeInfo = function(id, callback){
      // console.log("here");
      // console.log(id);
      $.getJSON(this.config.play_root + 'youtube-info/' + id, callback);
    }

    QP.setup = function(){
      var This = this;
      return $.getJSON('/config.json').done(
        function(data){
          This.config = data;
          This.initialize();
        });
    };

    QP.killHandler = function(){
      var This = this;
      $('.stop').click(function(){
        $.get("/kill", function() {
          location.reload();
        }).fail( This.to403 );
      });
    };

    //Get Queue Logic
    QP.getQueue = function(){
      var This = this;
      $.get("/list",function(data){
      if(data.length > 0){
      $('#tracks').remove();
      $('.data').append('<div id="tracks" class="span4"><h2>Queue</h2><ol></ol></div>');
      html='';


      // loading the queue data
      This.loadQueue(0,(data.length - 1), data);
      }
    });
    };
    QP.loadQueue = function (x,y,data){
      var This = this;
        console.log(">><<" +x+y+data);
          // youtube link (of any kind : multiple query parameters also)

           if(data[x][1] == 'youtube')
          {
            url = data[x][0];
            if(url.indexOf('?v=') != -1)
            {
              id = '';
              a = url.indexOf('?v=');
              for(var i=a+3;i<a+14;i++)
              {id = id + url[i];}
            }
            else if(url.indexOf('&v=') != -1)
            {
              id = '';
              a = url.indexOf('&v=');
              for(var i=a+3;i<a+14;i++)
              {id = id + url[i];}
            }
            // got this from hell, yeah really
            This.getYoutubeInfo(id, function(json){
              html+='<li mid="'+ id
                +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
                +json.data.thumbnail
                +'"><div class="entry1">'
                +json.data.title
                +'</div><div class="entry2">'
                +json.data.uploader
                +'</div><div style="clear:both">'
                +'</div></li>';
              $('#tracks ol').html(html);

              if(x+1<=y)
              {
                This.loadQueue(x+1,y,data);
              }
            });
          }
          // muzi link
          else{
          $.getJSON(This.config.muzi_root + 'track/info/' + data[x][1], function(track){

              html+='<li mid="'+track.id
                +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
                +This.config.pics_root
                +track.album_id
                +'.jpg"><div class="entry1">'
                +track.title
                +'</div><div class="entry2">'
                +track.artist
                +'</div><div style="clear:both">'
                +'</div></li>';
              $('#tracks ol').html(html);

              if(x+1<=y)
              {
                This.loadQueue(x+1,y,data);
              }
              })
          }
    };

    // now playing data
    QP.getNowPlaying = function(){
      var This = this;
      $.get("/current",function(data){
        This.renderPage(data);
      });
    };


    //Logic for page rendering
    QP.renderPage = function(data){
      var This = this;


      if(data.length > 0){

        $('.data').append('<div id="nowplaying" class="span4"><h2>Now Playing</h2><div class="combo"></div></div>');
        var htmlnew='';
        // matching number, muzi songs ID's are all numeric
        patt = /^\d+$/g;
        if(data[0].match(patt))
        {
          $.getJSON(This.config.muzi_root+'track/info/' + data[0],function(track){

            if(track.lyrics == 'NOT_FOUND' || track.lyrics == null ) {
              track.lyrics = null;
            }
          htmlnew+='<div mid="'+track.id
            +'"><img src="'
            +This.config.pics_root
            +track.album_id
            +'.jpg">'
            +'<div class="entry1">'
            +track.title
            +'<img src="../repeat.png" id="repeatButton" alt="Repeat" title="Repeat this song"/>'
            +'</div><div class="entry2">'
            +track.artist
            +'</div><div style="clear:both">'
            if( track.lyrics)
            {
              htmlnew  += '<button type="button" class="btn" id="lyricsButton">Lyrics</button>'
              +'</div></div><div class="lyrics">'
              +track.lyrics
              +'</div>';
              $('#nowplaying .combo').html(htmlnew);

              $('.lyrics').hide();
              $('#lyricsButton').click( function(){
              $('.lyrics').show();
              $(this).detach();
            });
            }
            else
            {
              $('#nowplaying .combo').html(htmlnew);
            }

          });
        }
        // youtube ID's have alphanumric and some special characters also
        else
        {
          This.getYoutubeInfo(data[0], function(json){
          htmlnew+='<div mid="'+data[0]
            +'"><img src="'
            +json.data.thumbnail
            +'"><div class="entry1">'
            +json.data.title
            +'<img src="../repeat.png" id="repeatButton" alt="Repeat" title="Repeat this song"/>'
            +'</div><div class="entry2">'
            +json.data.uploader
            +'</div><div style="clear:both">'
            +'</div></div>';
          $('#nowplaying .combo').html(htmlnew);
          });
        }

        $('.data').delegate('#repeatButton','click',function(){

          $.post('/repeat',{} ,function(result){
            //console.log(result);
            if(result)
            {
                var datavalue = "The song will be repeated";
                $(".entry1").attr("data-hint",""+datavalue+"");
                $(".entry1").addClass("hint--left hint--bounce");
                QP.showTooltip($(".entry1"), datavalue, "left");
            }
          }).fail( This.to403 );
          QP.removeTooltip($(".entry1"),"left");
        });

      }
    };

    // recent songs
    QP.getRecent = function(){
      var This = this;


      $.get("/recent", function(data){
        if(data.length > 0){
          $('#recent').remove();
          $('.data').append('<div id="recent" class="span4"><h2>Recent</h2><ol></ol></div>');

          html_recent = '';

        //
        This.loadRecent(0,(data.length - 1),data);
      }

    })
    };

    QP.loadRecent = function(x,y,data){
      var This = this;
          // matching number, muzi songs ID's are all numeric
          patt = /^\d+$/g;
          if(data[x] != undefined )
          {
            if(data[x].match(patt))
            {
              $.getJSON(This.config.muzi_root+'track/info/' + data[x],function(track){
              html_recent+='<li mid="'+track.id
                +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
                +This.config.pics_root
                +track.album_id
                +'.jpg"><div class="entry1">'
                +track.title
                +'</div><div class="entry2">'
                +track.artist
                +'</div><div style="clear:both">'
                +'</div></li>';

                $('#recent ol').html(html_recent);

                if(x+1<=y)
                {
                  This.loadRecent(x+1,y,data);
                }
              })
            }
            // youtube ID's have alphanumric and some special characters also
            else
            {
              This.getYoutubeInfo(data[x], function(json){
              html_recent+='<li mid="'+data[x]
                +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
                +json.data.thumbnail
                +'"><div class="entry1">'
                +json.data.title
                +'</div><div class="entry2">'
                +json.data.uploader
                +'</div><div style="clear:both">'
                +'</div></li>';
                $('#recent ol').html(html_recent);

                if(x+1<=y)
                {
                  This.loadRecent(x+1,y, data);
                }
              });
            }
          }
    };

    QP.addClickEvents = function(){
      var handle = this;

      $('.data').delegate('#recent ol li','click',function(e){
        //console.log('We clicked on a song from recent list');
        var trackId=this.getAttribute('mid');
        var patt = /^\d+$/g;
        // notification on adding a song
        // checking that, is there a song playing right now or not
        datavalue = "";
        This = $(this);
        if(trackId.match(patt)){

            $.getJSON(handle.config.muzi_root+"track/info/" + trackId,function(data){
              var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
              $.post('/play',{url:handle.config.music_root+url,id:data.id},function(){
                //console.log("Sent a play request");
                $.post(handle.config.muzi_root+'track/log',{id:data.id});
              }).fail( This.to403 );
            })
        }
        else {
          var link = 'https://www.youtube.com/watch?v='+trackId;
          $.post('/youtube',{link:link}).fail( This.to403 );
        }

      $.get("/now", function(result){
        if(result)
        {
          datavalue = "Added song to queue";
          QP.showTooltip(This, datavalue, top);
        }
        else
        {
          datavalue = "Playing it right now";
          QP.showTooltip(This, datavalue, top);
        }
        });

        QP.removeTooltip($(this),top);

      });
    };

    play.queue = new Queue();
    play.queue.setup();

}( window.jQuery, window.Play));
