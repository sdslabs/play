function updateTrackDetails(){
	$.get("/current",function(data){
		if(data){
			$.get('https://sdslabs.co.in/muzi/ajax/track/',{id:data},function(track){
				console.log(track);
				$('#albumart').attr('src','https://cdn.sdslabs.co.in/music_pics/'+track.albumId+'.jpg');
				$("#tracktitle").text(track.title);
				$("#trackalbum").text(track.albumName);
				$("#trackartist").text(track.artist);
			})
		}
	})
}
setInterval(updateTrackDetails,1000);