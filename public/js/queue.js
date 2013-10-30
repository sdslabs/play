if(window.location.pathname == "/queue"){ 
  $.getJSON('/config.json',function(config){
    $.get("/list",function(data){
      if(data){
      $('#tracks').remove();
      $('.data').append('<div id="tracks" class="span4"><h2>Queue</h2><ol></ol></div>');
      html='';
      
      function load_queue(x,y)
      {
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
                +config.pics_root
                +'.jpg"><div class="entry1">'
                +json.data.title
                +'</div><div class="entry2">'
                +json.data.uploader
                +'</div><div style="clear:both">'
                +'</div></li>';
              $('#tracks ol').html(html);
          
              if(x+1<=y)
              {
                load_queue(x+1,y);
              }
            })
          }
          // muzi link
          else{ 
          $.get(config.muzi_root + 'ajax/track/', {id:data[x][1]}, function(track){
          
              html+='<li mid="'+track.id
                +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
                +config.pics_root
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
                load_queue(x+1,y);
              } 
            })
          }
      }
      // loading the queue data
      load_queue(0,(data.length - 1));
      }
    })

    // now playing data
    $.get("/current",function(data){
      $('.data').append('<div id="nowplaying" class="span4"><h2>Now Playing</h2><div class="lyrics"></div></div>');
      htmlnew='';
      if(data){

        // matching number, muzi songs ID's are all numeric
        patt = /^\d+$/g;   
        if(data[0].match(patt))
        {
          $.get(config.muzi_root+'ajax/track/',{id:data[0]},function(track){
          htmlnew+='<div mid="'+track.id
            +'"><img src="'
            +config.pics_root
            +track.albumId
            +'.jpg"><div class="entry1">'
            +track.title
            +'</div><div class="entry2">'
            +track.artist
            +'</div><div style="clear:both">'
            +'</div></div><div class="lyrics">'
            +track.lyrics
            +'</div>';
          $('#nowplaying .lyrics').html(htmlnew);
          })
        }
        // youtube ID's have alphanumric and some special characters also
        else
        {
          $.getJSON('https://gdata.youtube.com/feeds/api/videos/' + data[0] + '?v=2&alt=jsonc', function(json){
          htmlnew+='<div mid="'+data[0]
            +'"><img src="'
            +config.pics_root
            +'.jpg"><div class="entry1">'
            +json.data.title
            +'</div><div class="entry2">'
            +json.data.uploader
            +'</div><div style="clear:both">'
            +'</div></div>';
          $('#nowplaying .lyrics').html(htmlnew);
          })
        }

      }
    })


  // recent songs
  $.get("/recent", function(data){
      if(data){
        $('#recent').remove();
        $('.data').append('<div id="recent" class="span4"><h2>Recent</h2><ol></ol></div>');

        html_recent = '';
        function load_recent(x,y)
      {

        // matching number, muzi songs ID's are all numeric
        patt = /^\d+$/g;   
        if(data[x].match(patt))
        {
          $.get(config.muzi_root+'ajax/track/',{id:data[x]},function(track){
          html_recent+='<li mid="'+track.id
            +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
            +config.pics_root
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
              load_recent(x+1,y);
            }
          })
        }
        // youtube ID's have alphanumric and some special characters also
        else
        {
          $.getJSON('https://gdata.youtube.com/feeds/api/videos/' + data[x] + '?v=2&alt=jsonc', function(json){
          html_recent+='<li mid="'+data[x]
            +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
            +config.pics_root
            +'.jpg"><div class="entry1">'
            +json.data.title
            +'</div><div class="entry2">'
            +json.data.uploader
            +'</div><div style="clear:both">'
            +'</div></li>';
            $('#recent ol').html(html_recent);
            
            if(x+1<=y)
            {
              load_recent(x+1,y);
            }
          })
        }
      }
      // 
      load_recent(0,(data.length - 1));
    }  
    //
    $('.data').delegate('#recent ol li','click',function(e){
      console.log('We clicked on a song from recent list');
      var trackId=this.getAttribute('mid')
      $.get(config.muzi_root+"ajax/track/",{id:trackId},function(data){
        var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
        $.post('/play',{url:config.music_root+url,id:data.id},function(){
          console.log("Sent a play request");
          $.get(config.muzi_root+'ajax/track/log.php',{id:data.id});
        })
      })
    });
    //
  })
  
})

}
