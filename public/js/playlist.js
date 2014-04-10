( function ( $, play){
	function Playlist(){
		this.config = null;
	};

	var PP = Playlist.prototype;

	var AMP = play.main;

	PP.setup = function(){
		var This = this;
		return $.getJSON('/config.json').done(
        function(data){
          This.config = data;
          This.initialize();
        });
	};

	PP.initialize = function(){
		this.addClickHandlers();
	}

	PP.getPlaylists = function(){
		var This = this;
		$.get(This.config.muzi_root + '/ajax/playlist/list.php	').done( function(data){
			var html ='<ul class="playlists">';
			for(i in data){
				html += '<li data-id="'+ data[i].id +'"><div class="entry1">'+ data[i].name + '</div><div class="entry2"> by ' + data[i].username +'</div></li>';
			}
			html += '</ul>';
			$(".data").html(html);
		});
	}

	PP.getSpecificPlaylist = function(id){
		var This = this;
		$.get(This.config.muzi_root + '/ajax/playlist/index.php', {id:id}).done(function(data){
			var html = '<div class="playlist-head"><div class="entry1">'+data.name + '</div><div class="entry2">by ' + data.username + '</div></div>' + '<ul class="playlist_tracks">';
			for(i in data.tracks){
				html += '<li mid="' + data.tracks[i].id;
                html +='"><div><img style="float:left" class="thumbnail" width="50" height="50" src="';
                html +=  This.config.pics_root;
                html += data.tracks[i].albumId;
                html += '.jpg"></div><div class="track-details"<span class="entry1">';
                html += data.tracks[i].title;
                html += '</span><span class="entry2">';
                html += data.tracks[i].artist;
                html += '</span><div style="clear:both"></div></li>';
			}
			html += '</ul>';
			$('.data').html(html);
		})
	}

	PP.addClickHandlers = function(){
		var This = this;
		$(".playlist-anchor").click(function(){
			This.getPlaylists();
		});
		$(".data").delegate(".playlists li", 'click', function(){
			This.getSpecificPlaylist($(this).attr('data-id'));
		});
		$('.data').delegate('.playlist_tracks li','click',function(e){
      //console.log('We clicked on a song from top list');
	      var trackId=this.getAttribute('mid');
	      // notification on adding a song
	      // checking that, is there a song playing right now or not
	      datavalue = "";
	      This = $(this);

	      $.get(AMP.config.muzi_root+"ajax/track/",{id:trackId},function(data){
	        var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
	        $.post('/play',{url:AMP.config.music_root+url,id:data.id},function(){
	          //console.log("Sent a play request");
	          $.get(AMP.config.muzi_root+'ajax/track/log.php',{id:data.id});
	        }).fail( AMP.to403 );
	      })

	      $.get("/now", function(result){
	        if(result)
	        {
	          datavalue = "Added song to queue";
	          AMP.showTooltip(This, datavalue, "left");
	        }
	        else
	        {
	          datavalue = "Playing it right now";
	          AMP.showTooltip(This, datavalue, "left");
	        }
	      });

	      AMP.removeTooltip($(this),"top");
	    });

	}
	play.playlist = new Playlist();
	play.playlist.setup();

}(window.jQuery, window.Play));