#Setup Instructions

Play by default uses the Muzi Database. If you've a local version of muzi
you can use it as well. Just copy over `public/config.example.json` to
`public/config.json` and edit it accordingly.

If you're running Play on linux, just make sure you have vlc installed
(`sudo apt-get install vlc`). If you're on Windows, please add `vlc.exe`
to your `%PATH%` as well.

You can test if vlc is working by editing and running the `vlctest.js` 
file in the lib directory.

The frontend is written in plain-vanilla JavaScript.

You can finally run Play with `node app.js`, although I'd suggest using 
something like `forever`, or `runjs` to re-run it automatically on file-changes.