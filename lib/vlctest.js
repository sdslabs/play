vlc=require('./vlc.js');

vlc.play("http://sdslabs.local/Music/English/Avril%20Lavigne/Let%20Go/01%20Losing%20Grip.mp3");

setTimeout(function(){
	vlc.play("http://sdslabs.local/Music/English/Avril%20Lavigne/Let%20Go/13%20Naked.mp3");
},5000);