(function($, play) {
  function Playlist() {
    this.config = null;
  };

  var PP = Playlist.prototype;

  var MP = play.main;

  PP.setup = function() {
    var This = this;
    return $.getJSON('/config.json').done(
      function(data) {
        This.config = data;
        This.initialize();
      });
  };

  PP.initialize = function() {
    this.addClickHandlers();
  }

  PP.getPlaylists = function() {
    var This = this;
    $.getJSON(This.config.muzi_root + 'playlist/list').done(function(data) {
      var html = '<ul id="playlists">';
      for (i in data) {
        html += '<li data-id="' + data[i].id + '"><div class="entry1">' + data[i].name + '</div>';
      }
      html += '</ul>';
      $(".data").html(html);
    });
  }

  PP.getSpecificPlaylist = function(id) {
    var This = this;
    $.getJSON(This.config.muzi_root + 'playlist/info/' + id).done(function(data) {
      var html = '<div class="playlist-head"><div class="entry1">' + data.name + '</div><div class="entry2">by ' + data.username + '</div></div>' + '<ul class="playlist_tracks">';
      for (i in data.tracks) {
        html += '<li mid="' + data.tracks[i].id;
        html += '"><div><img style="float:left" class="thumbnail" width="50" height="50" src="';
        html += This.config.pics_root;
        html += data.tracks[i].album_id;
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

  PP.addClickHandlers = function() {
    var This = this;
    $(".playlist-anchor").click(function() {
      This.getPlaylists();
    });
    $(".data").delegate("#playlists li", 'click', function() {
      This.getSpecificPlaylist($(this).attr('data-id'));
    });
    $('.data').delegate('.playlist_tracks li', 'click', function(e) {
      var trackId = this.getAttribute('mid');
      datavalue = "";

      $.getJSON(This.config.muzi_root + "track/info/" + trackId, function(data) {
        var url = data.file.split('/').map(function(x) { return encodeURIComponent(x); }).join('/');
        $.post('/play', { url: This.config.music_root + url, id: data.id }, function() {
          $.post(This.config.muzi_root + 'track/log', { id: data.id });
        }).fail(MP.to403);
      })
      var liHandle = $(this);

      $.get("/now", function(result) {
        if (result) {
          datavalue = "Added song to queue";
          MP.showTooltip(liHandle, datavalue, "left");
        } else {
          datavalue = "Playing it right now";
          MP.showTooltip(liHandle, datavalue, "left");
        }
      });

      MP.removeTooltip($(this), "");
    });

  }
  play.playlist = new Playlist();
  play.playlist.setup();

}(window.jQuery, window.Play));