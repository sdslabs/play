$(document).ready(function(){
    $('#searchbox').focus();
});
$.getJSON('/config.json',function(config){
  $("#searchbox").bind('keydown',function(e){
    if(e.keyCode===13){
      var text=this.value;
      if(text.substr(0,4)==="http"){
        //We have a youtube link for us
        $.post('/youtube',{link:text});
      }
      else{
        $.get(config.muzi_root+"ajax/search/",{search:text},function(data){
          console.log(data);
          console.log(config);
          $('#artists').remove();
          $('#tracks').remove();
          $('#albums').remove();
          $('.data').append('<div id="tracks" class="span4"><h2>Tracks</h2><ol></ol></div>');
          $('.data').append('<div id="artists" class="span4"><h2>Artists</h2><ol></ol></div>');
          $('.data').append('<div id="albums" class="span4"><h2>Albums</h2><ol></ol></div>');
          
          html='';
          for(i in data.tracks){
            html+='<li mid="'+data.tracks[i].id
              +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
              +config.pics_root
              +data.tracks[i].albumId
              +'.jpg"><div class="entry1">'
              +data.tracks[i].title
              +'</div><div class="entry2">'
              +data.tracks[i].artist
              +'</div><div style="clear:both">'
              +'</div></li>'
          }
          $('#tracks ol').html(html);

          html='';
          for(i in data.artists){
            html+='<li mt="artist" mid="'
            +data.artists[i].id+
            '"><img style="float:left" class="thumbnail" width="50" height="50" src="'
            +config.artist_pics_root
            +data.artists[i].id
            +'.jpg"><div class="entry1">'
            +data.artists[i].name
            +'</div><div style="clear:both"></div></li>'
          }
          $('#artists ol').html(html);
          https://sdslabs.co.in/muzi/artist_pics/17.jpg

          html='';
          for(i in data.albums){
            html+='<li mt="album" mid="'
            +data.albums[i].id
            +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
            +config.pics_root
            +data.albums[i].id
            +'.jpg"><div class="entry1">'
            +data.albums[i].name
            +'</div><div class="entry2">'
            +data.albums[i].band
            +'</div><div style="clear:both">'
            +'</div></li>'

          }
          $('#albums ol').html(html);
        });
      }
    }
  });
  
  $('.data').delegate('#tracks ol li','click',function(e){
    console.log('We clicked on a song!');
    var trackId=this.getAttribute('mid')
    $.get(config.muzi_root+"ajax/track/",{id:trackId},function(data){
      var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
      $.post('/play',{url:config.music_root+url,id:data.id},function(){
        console.log("Sent a play request");
      })
    })
  });  
  
  $('.data').delegate('#artists ol li','click',function(e){
    //We clicked on an artist!
    //console.log('We clicked on an artist!');

    var artistId=this.getAttribute('mid');
    $.get(config.muzi_root+"ajax/band/albums.php",{id:artistId},function(data){
      $('#artists').remove();
      $('#tracks').remove();
      $('#albums').removeClass().addClass('span4 offset4');
      html='';
      for(i in data.albums){
        html+='<li mt="album" mid="'
        +data.albums[i].id
        +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
        +config.pics_root
        +data.albums[i].id
        +'.jpg"><div class="entry1">'
        +data.albums[i].name
        +'</div><div class="entry2">'
        +data.albums[i].band
        +'</div></li>'
      }
      $('#albums ol').html(html);
    })
  });
  
  $('.data').delegate('#albums ol li','click',function(e){
    //console.log('We clicked on an album!');

    var albumId=this.getAttribute('mid');
    $.get(config.muzi_root+"ajax/album/index.php",{id:albumId},function(data){
      $('#albums').remove();
      $('#artists').remove();
      $('#tracks h2').remove();
      $('.data').append('<div id="tracks" class="span4"><h2>Tracks</h2><ol></ol></div>');
      $('#tracks').removeClass().addClass('span4 offset4 single');
      html='<div><img style="float:left" class="thumbnail" width="50" height="50" src="'
        +config.pics_root
        +data.id
        +'.jpg"><h3>'
        +data.band
        +'</h3></div><div style="clear: both"><h4>'
        +data.name
        +'</h4></div>';
      for(i in data.tracks){
        html+='<li mt="track" mid="'
        +data.tracks[i].id
        +'"><div class="entry1">'
        +data.tracks[i].title
        +'</div></li>'
      }
      $('#tracks ol').html(html);
    })
  });

})
