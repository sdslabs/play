exports.index = function(req, res){
  res.sendfile("index.html");
};
var mpg123=require("../lib/mpg123.js");
exports.play = function(req,res){
	mpg123.play("http://sdslabs.local/Music/"+req.body.url);
};