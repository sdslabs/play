/**
 * Module dependencies.
 */

  var express = require("express");
  var app = express();
  var http = require('http');
  var routes = require('./routes');
  var path = require('path');

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname,'./public')));
  app.set('port', process.env.PORT || 3000);
});

// Routes

app.get('/', routes.index);
app.get('/current',routes.current);
//app.get('/pause',routes.pause);
app.get('/kill',routes.kill);
app.get('/queue',routes.queuelist);
app.get('/list',routes.list);
app.get('/recent',routes.recent);
app.get('/now',routes.now);
app.post('/play',routes.play);
app.post('/repeat', routes.repeat);
app.post('/youtube',routes.youtube);
http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});
