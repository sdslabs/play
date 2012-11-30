mpg123=require('./mpg123.js');

mpg123.play("http://sdslabs.local/Music/English/Avril%20Lavigne/Let%20Go/01%20Losing%20Grip.mp3");

setTimeout(function(){
	mpg123.play("http://sdslabs.local/Music/English/Avril%20Lavigne/Let%20Go/13%20Naked.mp3");
},5000);