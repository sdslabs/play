if(window.location.pathname == "/queue"){ 
  $.getJSON('/config.json',function(config){
      $.get("/list",function(data){
      $('#tracks').remove();
      $('.data').append('<div id="tracks" class="span4"><h2>Queue</h2><ol></ol></div>');
      html='';
      
      function load_queue(x,y)
      {
        $.get(config.muzi_root + 'ajax/track/', {id:data[x][1]}, function(track){
          console.log(track);
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
      load_queue(0,(data.length - 1));
      
    })
    $.get("/current",function(data){
      $('.data').append('<div id="nowplaying" class="span4"><h2>Now Playing</h2><div class="lyrics"></div></div>');
      htmlnew='';
      if(data){
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
    })

    // showing recent songs
    $.get("/recent", function(data){
      $('#recent').remove();
      $('.data').append('<div id="recent" class="span4"><h2>Recent</h2><ol></ol></div>');

      html_recent = '';

      function load_recent(x,y)
      {
        $.get(config.muzi_root + 'ajax/track/', {id:Number(data[x])}, function(track){
          console.log(track);
          html_recent += '<li mid="'+track.id
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

      load_recent(0,(data.length - 1));
    })
    //

  })

}

