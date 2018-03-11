const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000;
let userDb = [{name: 'Igor', password: '2103'}];
let userOnline = [];

let app = express();
let server = http.createServer(app).listen(PORT, function () {
	console.log('Express server listening on port: ' + PORT);
});

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.post('/access', function (req, res, next) {
	if(checkUserAndPass(req.body)){
		res.send({access: true, name: req.body.name, userDbL: userDb.length, userDb: userDb});
	}else {
		res.send({access: false});
	}
	next();
});
app.use(express.static('public'));
app.use(function (err, req, res, next) {
	if ( app.get('env') === 'development' ) {
		let errorHandler = express.errorHandler();
		errorHandler(err, req, res, next);
	} else {
		res.send(500);
	}
});


let io = require('socket.io')(server);

io.on('connection', function (socket) {
	// console.log('Клиент подключился');
	socket.emit('message', {text: 'connection: ok'});

	socket.on('messageUserAll', function (data, cb) {
		data.time = getDateNow();
		socket.broadcast.emit('messagePublic', data);
		// console.log(data.text);
		cb(data.time);
	})

	socket.on('messageUser', function (data, cb) {
		data.time = getDateNow();
		socket.broadcast.emit('message', data);
		console.log(data.text);
		cb(data.time);
	})

});

function getDateNow() {
	let date = new Date();
	let time = date.getHours();
	time += ':' + date.getMinutes();
	return time;
}

function checkUserAndPass(userQuery) {
	for(let i = 0; i < userDb.length; i++){
		let user = userDb[i];
		if(userQuery.name === user.name){
			if(userQuery.password === user.password){
				return true;
			}
			return false;
		}
	}
	userDb.push(userQuery);
	return true;
}