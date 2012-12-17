$.getJSON('/config.json',function(config){
  function updateTrackDetails(){
    $.get("/current",function(data){
      if(data){
        $.get(config.muzi_root+'ajax/track/',{id:data},function(track){
          console.log(track);
          $('#albumart').attr('src',config.pics_root+track.albumId+'.jpg');
          $("#tracktitle").text(track.title);
          $("#trackalbum").text(track.albumName);
          $("#trackartist").text(track.artist);
        })
      }
    })
  }
  setInterval(updateTrackDetails,1000); 
})
