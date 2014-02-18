$(document).ready(function(){
    $('#searchbox').focus();
});

if(window.location.pathname !== "/queue") {
  //for home
  $('.stop').click(function(){
    $.get("/kill");
  });
}

$.getJSON('/config.json',function(config){
  $("#searchbox").bind('keydown',function(e){
    //
    $('#_1').remove();
    $('#_2').remove();
    $('#_3').remove();
    $('#_4').remove();
    $('.hr').remove();

    //Bind the enter key to the handler
    if(e.keyCode===13){
      var text=this.value;
      if(text.substr(0,4)==="http"){
        //We have a youtube link for us
        $.post('/youtube',{link:text});
        //Empty the search box if its youtube link
        this.value = '';
      }
      else{
        $.get(config.muzi_root+"ajax/search/",{search:text},function(data){
		      // removing old data to show new
		      $('#alert').remove();
	       	$('#artists').remove();
        	$('#tracks').remove();
	        $('#albums').remove();
            var dataHandle = $('.data');
        		// showing no 'result' alert thing
        		if((data.tracks.length==0) && (data.albums.length==0) && (data.artists.length==0))
        		{
        			dataHandle.append('<div id="alert" style="text-align:center;"><h2>No Result Found</h2></div>');
        		}

            else {

            dataHandle.append('<div id="tracks" class="span4"><h2>Tracks</h2><ol></ol></div>');
            dataHandle.append('<div id="artists" class="span4"><h2>Artists</h2><ol></ol></div>');
            dataHandle.append('<div id="albums" class="span4"><h2>Albums</h2><ol></ol></div>');

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
            //console.log(html);
            $('#tracks ol').html(html);

            html='';
            for(i in data.artists){
              html+='<li mt="artist" mid="'
              +data.artists[i].id+
              '"><img style="float:left" class="thumbnail" width="50" height="50" src="'
              +config.pics_root
              +data.artists[i].id
              +'.jpg"><div class="entry1">'
              +data.artists[i].name
              +'</div><div style="clear:both"></div></li>'
            }
            $('#artists ol').html(html);

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
	}
        });
      }
    }
  });

  $('.stop').click(function(){
    $.get("/kill");
  });

  //showing top songs from muzi leaderboard
  $.get(config.muzi_root+"ajax/track/top.php", function(data){

    var dataHandle = $('.data');
    // 4 columns for top songs
    dataHandle.append('<div id="_1" class="span3 top"><ol></ol></div>');
    dataHandle.append('<div id="_2" class="span3 top"><ol></ol></div>');
    dataHandle.append('<div id="_3" class="span3 top"><ol></ol></div>');
    dataHandle.append('<div id="_4" class="span3 top"><ol></ol></div>');

    function html(x)
    {
      // substring of title, if it is lengthy
      if(data[x].title.length > 28)
      {
        tempt = data[x].title.substring(0,26);
        data[x].title = tempt + '...';
      }
      // substring of artist, if it is lengthy
      if(data[x].artist.length > 30)
      {
        tempa = data[x].artist.substring(0,28);
        data[x].artist = tempa + '...';
      }

      content = '<li mid="'+data[x].id
      +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
      +config.pics_root
      +data[x].albumId
      +'.jpg"><div class="entry1">'
      +data[x].title
      +'</div><div class="entry2">'
      +data[x].artist
      +'</div><div style="clear:both">'
      +'</div></li>'

      return content;
    }

    // showing top 20 songs, 5 per column
    $('#_1').html(html(0) + html(1) + html(2) + html(3) + html(4));
    $('#_2').html(html(5) + html(6) + html(7) + html(8) + html(9));
    $('#_3').html(html(10) + html(11) + html(12) + html(13) + html(14));
    $('#_4').html(html(15) + html(16) + html(17) + html(18) + html(19));

  })
  //

  // adding a top song to queue, when clicked on homepage
  $('.data').delegate('.top li','click',function(e){
    //console.log('We clicked on a song from top list');
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
    $.get(config.muzi_root+"ajax/track/",{id:trackId},function(data){
      var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
      $.post('/play',{url:config.music_root+url,id:data.id},function(){
        //console.log("Sent a play request");
        $.get(config.muzi_root+'ajax/track/log.php',{id:data.id});
      })
    })
  });
  //

  $('.data').delegate('#tracks ol li','click',function(e){
    //console.log('We clicked on a song!');
    var trackId=this.getAttribute('mid')
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
    $.get(config.muzi_root+"ajax/track/",{id:trackId},function(data){
      var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
      $.post('/play',{url:config.music_root+url,id:data.id},function(){
        //console.log("Sent a play request");
        $.get(config.muzi_root+'ajax/track/log.php',{id:data.id});
      })
    })
  });

  $('.data').delegate('#artists ol li','click',function(e){
    //We clicked on an artist!

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
        +'</div><div style="clear: both"></div></li>'
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
      $('#tracks').remove();
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

