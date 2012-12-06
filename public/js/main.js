$("#searchbox").bind('keydown',function(e){
	if(e.keyCode===13){
		var text=this.value;
		$.get("https://sdslabs.co.in/muzi/ajax/search/",{search:text},function(data){
			html='';
			for(i in data.tracks){
				html+='<li mid="'+data.tracks[i].id+'">'+data.tracks[i].title+'</li>'
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