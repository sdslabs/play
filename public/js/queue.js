(function($){


if(window.location.pathname == "/queue"){
    function Queue(){
      this.config = null;
    };

    var QP = Queue.prototype;

    QP.initialize = function(){
      this.getConfig();
      this.killHandler();
      this.getNowPlaying();
      this.getQueue();
      this.getRecent();
      this.addClickEvents();
    }

    QP.getConfig = function(){
      return $.getJSON('/config.json').done(
        function(data){
          this.config = data;
        });
    }

    QP.killHandler = function(){
        $('.stop').click(function(){
        $.get("/kill");
        $('#nowplaying').remove();
        //rerender page
        $.post("/next",{},function(data){
          this.renderPage(data);
          });
        this.getQueue();
        this.getRecent();
      });
    };

    //Get Queue Logic
    QP.getQueue = function(){
      $.get("/list",function(data){
      if(data.length > 0){
      $('#tracks').remove();
      $('.data').append('<div id="tracks" class="span4"><h2>Queue</h2><ol></ol></div>');
      html='';


      // loading the queue data
      this.loadQueue(0,(data.length - 1), data);
      }
    });
    };
    QP.loadQueue = function (x,y,data){

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

            // got this from hell
            $.getJSON('https://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=jsonc', function(json){
              html+='<li mid="'+ id
                +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
                +this.config.pics_root
                +'.jpg"><div class="entry1">'
                +json.data.title
                +'</div><div class="entry2">'
                +json.data.uploader
                +'</div><div style="clear:both">'
                +'</div></li>';
              $('#tracks ol').html(html);

              if(x+1<=y)
              {
                this.loadQueue(x+1,y,data);
              }
            })
          }
          // muzi link
          else{
          $.get(this.config.muzi_root + 'ajax/track/', {id:data[x][1]}, function(track){

              html+='<li mid="'+track.id
                +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
                +this.config.pics_root
                +track.albumId
                +'.jpg"><div class="entry1">'
                +track.title
                +'</div><div class="entry2">'
                +track.artist
                +'</div><div style="clear:both">'
                +'</div></li>';
              $('#tracks ol').html(html);

              if(x+1<=y)
              {
                this.loadQueue(x+1,y,data);
              }
            })
          }
    };

    // now playing data
    QP.getNowPlaying = function(){
      $.get("/current",function(data){
        this.renderPage(data);
      });
    };


    //Logic for page rendering
    QP.renderPage = function(data){


      if(data.length > 0){

        $('.data').append('<div id="nowplaying" class="span4"><h2>Now Playing</h2><div class="combo"></div></div>');
        var htmlnew='';
        // matching number, muzi songs ID's are all numeric
        patt = /^\d+$/g;
        if(data[0].match(patt))
        {
          $.get(this.config.muzi_root+'ajax/track/',{id:data[0]},function(track){

            if(track.lyrics == 'NOT_FOUND' || track.lyrics == null ) {
              track.lyrics = null;
            }
          htmlnew+='<div mid="'+track.id
            +'"><img src="'
            +this.config.pics_root
            +track.albumId
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
          $.getJSON('https://gdata.youtube.com/feeds/api/videos/' + data[0] + '?v=2&alt=jsonc', function(json){
          htmlnew+='<div mid="'+data[0]
            +'"><img src="'
            +this.config.pics_root
            +'.jpg"><div class="entry1">'
            +json.data.title
            +'<img src="../repeat.png" id="repeatButton" alt="Repeat" title="Repeat this song"/>'
            +'</div><div class="entry2">'
            +json.data.uploader
            +'</div><div style="clear:both">'
            +'</div></div>';
          $('#nowplaying .combo').html(htmlnew);
          })
        }

        $('.data').delegate('#repeatButton','click',function(){
          $.post('/repeat',{} ,function(result){
            //console.log(result);
            if(result)
            {
                var datavalue = "The song will be repeated";
                $(".entry1").attr("data-hint",""+datavalue+"");
                $(".entry1").addClass("hint--left hint--bounce");
            }
          });
        });

      }
    };

    // recent songs
    QP.getRecent = function(){


      $.get("/recent", function(data){
        if(data.length > 0){
          $('#recent').remove();
          $('.data').append('<div id="recent" class="span4"><h2>Recent</h2><ol></ol></div>');

          html_recent = '';

        //
        loadRecent(0,(data.length - 1),data);
      }

    })
    };

    QP.loadRecent = function(x,y,data){
          // matching number, muzi songs ID's are all numeric
          patt = /^\d+$/g;
          if(data[x].match(patt))
          {
            $.get(this.config.muzi_root+'ajax/track/',{id:data[x]},function(track){
            html_recent+='<li mid="'+track.id
              +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
              +this.config.pics_root
              +track.albumId
              +'.jpg"><div class="entry1">'
              +track.title
              +'</div><div class="entry2">'
              +track.artist
              +'</div><div style="clear:both">'
              +'</div></li>';

              $('#recent ol').html(html_recent);

              if(x+1<=y)
              {
                this.loadRecent(x+1,y,data);
              }
            })
          }
          // youtube ID's have alphanumric and some special characters also
          else
          {
            $.getJSON('https://gdata.youtube.com/feeds/api/videos/' + data[x] + '?v=2&alt=jsonc', function(json){
            html_recent+='<li mid="'+data[x]
              +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
              +this.config.pics_root
              +'.jpg"><div class="entry1">'
              +json.data.title
              +'</div><div class="entry2">'
              +json.data.uploader
              +'</div><div style="clear:both">'
              +'</div></li>';
              $('#recent ol').html(html_recent);

              if(x+1<=y)
              {
                this.loadRecent(x+1,y);
              }
            })
          }

    }

    QP.addClickEvents = function(){

      $('.data').delegate('#recent ol li','click',function(e){
        //console.log('We clicked on a song from recent list');
        var trackId=this.getAttribute('mid');
        // notification on adding a song
        // checking that, is there a song playing right now or not
        datavalue = "";
        This = $(this);
        $.get("/now", function(result){
          if(result)
          {
                  datavalue = "added song to queue";
                  //console.log(datavalue);
                  This.attr("data-hint",""+datavalue+"");
                  This.addClass("hint--top hint--bounce");
          }
          else
          {
                  datavalue = "playing it right now";
                  //console.log(datavalue);
                  This.attr("data-hint",""+datavalue+"");
                  This.addClass("hint--top hint--bounce");
          }
        })

        $(this).mouseleave(function(){
          $(this).removeClass("hint--top");
          $(this).removeAttr("data-hint");
        });
        //
        $.get(this.config.muzi_root+"ajax/track/",{id:trackId},function(data){
          var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
          $.post('/play',{url:this.config.music_root+url,id:data.id},function(){
            //console.log("Sent a play request");
            $.get(this.config.muzi_root+'ajax/track/log.php',{id:data.id});
          })
        })
      });
    }



}
}(window.jQuery));