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
  app.use(express.static(path.join(__dirname,'./views')));
  app.use(express.static(path.join(__dirname,'./public')));
  app.set('port', process.env.PORT || 3000);
  app.set('view engine','jade');
  app.set('views',__dirname+'/views');
  app.enable('trust proxy');
});

// Routes

app.get('/', routes.index);
app.get('/current',routes.current);
//app.get('/pause',routes.pause);
app.get('/kill',routes.checkIp, routes.kill);
app.get('/queue',routes.queuelist);
app.get('/list',routes.list);
app.get('/recent',routes.recent);
app.get('/now',routes.now);
app.post('/play', routes.checkIp, routes.play);
app.post('/repeat', routes.checkIp, routes.repeat);
app.post('/next', routes.next);
app.post('/youtube',routes.checkIp, routes.youtube);

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});
