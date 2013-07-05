#SDSLabs Music Player

Play is the internal music player for SDSLabs. Kinda like how github/play works, but
we use our own player (Muzi) as the backend instead of iTunes.
This means we can play all songs of muzi inside the lab using this

#How
It internally uses child\_process to call up muzi, which does all
the streaming. This means, we can only "kill" the process to stop the song,
and there is no support for skipping at all.

#Why
Because we didn't have a mac to use github/play

#Licence
Licenced under MIT Licence. Feel free to contribute.


#Screenshots

![Home Page](http://i.imgur.com/F3Gryn5.jpg)

Home Page

![Search Page](http://i.imgur.com/PaxKOu3.jpg)

Search Results

![Now Playing](http://i.imgur.com/Ubuz3FQ.jpg)

Now Playing screen
