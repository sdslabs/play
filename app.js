/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Routes

app.get('/', routes.index);
app.get('/playing',function(req,res){
	res.sendfile("public/nowplaying.html");
});
app.get('/current',routes.current);
//app.get('/pause',routes.pause);
app.post('/play',routes.play);
app.post('/youtube',routes.youtube)
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
