$(document).ready(function(){
    $('#searchbox').focus();
});
$("#searchbox").bind('keydown',function(e){
	if(e.keyCode===13){
		var text=this.value;
		$.get("https://sdslabs.co.in/muzi/ajax/search/",{search:text},function(data){
			html='';
			for(i in data.tracks){
				html+='<li mid="'+data.tracks[i].id
					+'"><img style="float:left" class="thumbnail" width="50" height="50" src="https://cdn.sdslabs.co.in/music_pics/'
					+data.tracks[i].albumId
					+'.jpg">'
					+data.tracks[i].title
					+"<br>"
					+data.tracks[i].artist
					+"<br><div style='clear:both'>"
					+'</li>'
			}
			$('#tracks').html(html);
		});
	}
});
$('#tracks').delegate('li','click',function(e){
	//We clicked on a song!
	var trackId=this.getAttribute('mid')
	$.get("https://sdslabs.co.in/muzi/ajax/track/",{id:trackId},function(data){
		var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
		$.post('/play',{url:url,id:data.id},function(){
			console.log("Sent a play request");
		})
	})
});
