const express = require('express');
// const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
let userDb = [{name: 'Igor', password: '2103'}];
let userOnline = [];

let app = express();
let server = http.createServer(app).listen(PORT, function () {
	console.log('Express server listening on port: ' + PORT);
});

// app.use(bodyParser.urlencoded({
// 	extended: true
// }));
// app.use(bodyParser.json());
app.use(express.static('public'));
app.use(function (err, req, res, next) {
	if ( app.get('env') === 'development' ) {
		let errorHandler = express.errorHandler();
		errorHandler(err, req, res, next);
	} else {
		res.send(500);
	}
});

//================================================= socket io ==============================

let io = require('socket.io')(server);

io.on('connection', function (socket) {
	// console.log('Клиент подключился', socket.id, userOnline.length);
	socket.on('setNickName', function (data) {
		// console.log(data.name);
		if ( setUser(data) ) {
			socket.emit('nickNameInit', {error: null, name: data.name, userOnline: getUserOnline()});//getUserOnline()  ['petya', 'vasya', 'dima', 'kiril', 'gogashvili']
			socket.broadcast.emit('joinedUser', {name: data.name});
			socket.session = data;
			userOnline.push(socket);
		} else {
			socket.emit('nickNameInit', {error: 'Такой логин уже существует или неверный пароль', name: data.name});
			socket.disconnect(true);
		}
	});

	socket.on('disconnecting', function () {
		for ( let i = 0; i < userOnline.length; i++ ) {
			let socketDbUser = userOnline[i];
			if ( socketDbUser.id === socket.id ) {
				userOnline.splice(i, 1);
				// console.log(socketDbUser.session.name);
				socket.broadcast.emit('disconnectUser', {name: socketDbUser.session.name});
			}
		}
	});

	socket.on('messageUserAll', function (data, cb) {
		data.time = getDateNow();
		socket.broadcast.emit('messagePublic', data);
		// console.log(data.text);
		cb(data.time);
	});
});

function setUser(user) {
	for ( let i = 0; i < userDb.length; i++ ) {
		let userBase = userDb[i];
		if ( user.name === userBase.name ) {
			return (user.password === userBase.password);
		}
	}
	userDb.push(user);
	return true;
}

function getDateNow() {
	let date = new Date();
	let time = date.getUTCHours();
	time += ':' + date.getUTCMinutes();
	return time;
}

function getUserOnline() {
	let users = [];
	for ( let i = 0; i < userOnline.length; i++ ) {
		users.push(userOnline[i].session.name)
	}
	return users;
}

