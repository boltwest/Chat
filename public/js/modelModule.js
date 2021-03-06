let chat = {};
chat.model = (function () {
	let my = {};
	let viewComponent;
	let socket;
	let properties = {
		registration: false,
		error: false,
		name: 'Igor',
		nameRoom: 'LogIn',
		showListOnline: false,
		userOnline: []
	};

	function getTime() {
		let clock = '';
		let date = new Date();
		clock += date.getHours() + ':';
		clock += date.getMinutes();
		return clock;
	}

	my.init = function (view) {
		viewComponent = view;
	};
	my.cl = function () {
		socket.close();
	};

	my.checkUser = function (login, pass) {
		my.vibration(20);
		socket = io();
		socket.emit('setNickName', {name: login, password: pass});
		socket.on('nickNameInit', function (data) {
			// console.log(data);
			if ( !data.error ) {
				properties.userOnline = data.userOnline;
				properties.registration = true;
				properties.name = data.name;
				properties.nameRoom = 'publicChat';
				my.updateViewComponent();
				my.updateUserOnlineList();
			} else {
				properties.error = true;
				my.updateViewComponent();
			}
		});
		socket.on('messagePublic', function (data) {
			data.room = 'publicChat';
			my.updateViewUserMessage(data);
		});
		socket.on('disconnectUser', function (data) {
			for(let i = 0; i < properties.userOnline.length; i++){
				let user = properties.userOnline[i];
				if(user === data.name){
					properties.userOnline.splice(i, 1);
				}
			}
			my.removeUser(data.name);
		});
		socket.on('joinedUser', function (data) {
			properties.userOnline.push(data.name);
			my.joinedUser(data.name);
		});
		socket.on('messagePrivateRequire', function (data) {
			my.updateViewUserMessage(data);
			my.notification(data);
			my.vibration([200,100,300,100]);
		})
	};

	my.get = function (prop) {
		return properties[prop];
	};

	my.sendMessage = function (text) {
		my.vibration(20);
		if ( properties.nameRoom === 'publicChat' ) {
			socket.emit('messageUserAll', {name: properties.name, text: text}, function () {
				let data = {
					text: text,
					name: properties.name,
					room: 'publicChat'
				};
				my.updateViewUserMessage(data);
			})
		} else {
			socket.emit('messagePrivate', {name: properties.name, text: text, room: properties.nameRoom}, function () {
				let data = {
					text: text,
					name: properties.name,
					room: properties.nameRoom
				};
				my.updateViewUserMessage(data);
			})
		}
	};

	my.updateViewUserMessage = function (data) {
		data.time = getTime();
		viewComponent.addMessageChat(data);
	};

	my.updateViewComponent = function () {
		viewComponent.updateView();
	};

	my.showListOnline = function () {
		properties.showListOnline = !properties.showListOnline;
		my.updateViewComponent();
	};

	my.updateUserOnlineList = function () {
		viewComponent.updateUsersOnlineList();
	};

	my.joinedUser = function (name) {
		viewComponent.addUserOnlineList(name);
	};

	my.removeUser = function (name) {
		if(name !== properties.nameRoom) {
			viewComponent.removeUserOnlineList(name);
			return;
		}
		my.selectPrivateRoom('publicChat');
		viewComponent.removeUserOnlineList(name);
	};

	my.selectPrivateRoom = function (name) {
		properties.nameRoom = name;
		my.updateViewComponent();
		viewComponent.updatePrivateField();
		// console.log(name);
	};

	my.notification = function (data) {
		viewComponent.showNotification(data)
	};

	my.vibration = function (val) {
		viewComponent.vibro(val)
	};


	return my;
})();