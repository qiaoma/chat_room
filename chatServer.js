var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
//var fs = require('fs');
//var httpServer = require('http');
var sio = require('socket.io');

//attach the socket.io server
var io = sio.listen(server);
server.listen(3000);

var usernames = [];


app.get('/', function(req, res){

	res.sendfile(__dirname + '/chat.html');
});
//server receive event, turn on the connection event
io.sockets.on('connection', function(socket){

	//receive username from client
	socket.on('username', function(username, usernameSend){
		//username have already taken
		if(usernames.indexOf(username) != -1){
			usernameSend(false);
		}else{
			usernameSend(true);
			socket.username = username;
			usernames.push(username);
		}
	});
	//receive user message from client
	socket.on('message', function(message){
		//socket.broadcast.emit('message', message);
		var sendmsg = {'user': socket.username, 
						'msg': message
					  };
		io.sockets.emit('message', sendmsg);
	});
});