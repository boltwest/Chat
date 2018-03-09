const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000;


var app = express();
var server = http.createServer(app).listen(PORT, function () {
	console.log('Express server listening on port: ' + PORT);
});


//app.use(express.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.post('/access', function (req, res, next) {
	var userName = req.body.userName;
	var userPassword = req.body.userPassword;
	console.log(userPassword, userName);
	res.send({access: true, usersOnline: ['mi', 'uoy', 'we']});
	next();
});
app.use(express.static('public'));
app.use(function (err, req, res, next) {
	if ( app.get('env') === 'development' ) {
		var errorHandler = express.errorHandler();
		errorHandler(err, req, res, next);
	} else {
		res.send(500);
	}
});


var io = require('socket.io')(server);

io.on('connection', function (socket) {
	console.log('Клиент подключился');
	socket.emit('message', {text: 'connection: ok'});

	socket.on('messageUser', function (data, cb) {
		socket.broadcast.emit('message', data);
		console.log(data.text);
		cb();
	})

});