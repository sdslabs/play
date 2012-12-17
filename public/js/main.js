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
          html='';
          console.log(config);
          for(i in data.tracks){
            html+='<li mid="'+data.tracks[i].id
              +'"><img style="float:left" class="thumbnail" width="50" height="50" src="'
              +config.pics_root
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
    }
  });
  $('#tracks').delegate('li','click',function(e){
    //We clicked on a song!
    var trackId=this.getAttribute('mid')
    $.get(config.muzi_root+"ajax/track/",{id:trackId},function(data){
      var url=data.file.split('/').map(function(x){return encodeURIComponent(x);}).join('/');
      $.post('/play',{url:config.music_root+url,id:data.id},function(){
        console.log("Sent a play request");
      })
    })
  });  
})
