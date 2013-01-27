if(window.location.pathname == "/queue"){ 
  $.getJSON('/config.json',function(config){
      $.get("/list",function(data){
      $('#tracks').remove();
      $('.data').append('<div id="tracks" class="span4"><h2>Queue</h2><ol></ol></div>');
      html='';
      for(i in data){
        $.get(config.muzi_root+'ajax/track/',{id:data[i][1]},function(track){
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

          /*$('#albumart').attr('src',config.pics_root+track.albumId+'.jpg');
          $("#tracktitle").text(track.title);
          $("#trackalbum").text(track.albumName);
          $("#trackartist").text(track.artist);*/
        })
      }
    })
    $.get("/current",function(data){
      $('.data').append('<div id="nowplaying" class="span8"><h2>Now Playing</h2><div class="lyrics"></div></div>');
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
  })

}