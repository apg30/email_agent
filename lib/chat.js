var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require("../config.js");
var port = process.env.PORT || config.chat_port;
var path = require('path');


module.exports = {
  start: function(){

    app.get('/', function(req, res){
      res.render(path.resolve('views/chat.ejs'), {port: config.chat_port});
    });

    io.on('connection', function(socket){
      socket.on('chat message', function(msg){
        io.emit('chat message', msg);
      });
    });

    http.listen(port, function(){
      console.log('Chat on port:' + port);
    });
  }
};
