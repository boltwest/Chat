const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 5000;


var app = express();

var server = http.createServer(app).listen(PORT, function(){
	console.log('Express server listening on port: ' + PORT);
});

var io = require('socket.io')(server);

app.use(express.static('public'));
app.use(function (err, req, res, next) {
	if (app.get('env') === 'development') {
		var errorHandler = express.errorHandler();
		errorHandler(err, req, res, next);
	}else {
		res.send(500);
	}
});



io.on('connection', function (socket) {
	console.log('Клиент подключился');
	socket.emit('message', {text: 'connect: ok'});

	socket.on('messageUser', function (data, cb) {
		socket.broadcast.emit('message', data);
		console.log(data.text);
		cb();
	})


});