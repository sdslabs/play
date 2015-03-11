vlc=require('./vlc.js');

vlc.play("https://music.sdslabs.co.in/English/Ellie%20Goulding/Love%20Me%20Like%20You%20Do/01%20-%20Love%20Me%20Like%20You%20Do.mp3");

setTimeout(function(){
	vlc.play("http://sdslabs.local/Music/English/Avril%20Lavigne/Let%20Go/13%20Naked.mp3");
},5000);