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
		socket = io();
		socket.emit('setNickName', {name: login, password: pass});
		socket.on('nickNameInit', function (data) {
			console.log(data);
				if ( !data.error ) {
					properties.userOnline = data.userOnline;
					properties.registration = true;
					properties.name = data.name;
					properties.nameRoom = 'Public chat';
					my.updateViewComponent();
					my.updateUserOnlineList();
				} else {
					properties.error = true;
					my.updateViewComponent();
				}
		});
		socket.on('messagePublic', function (data) {
			my.updateViewUserMessage(data);
		});
		socket.on('disconnectUser', function (data) {
			my.removeUser(data.name);
			// console.log('disc: ', data.name);
		});
		socket.on('joinedUser', function (data) {
			my.joinedUser(data.name);
			// console.log('joined: ', data.name);
		});

		// $.ajax({
		// 	type: "POST",
		// 	url: '/access',
		// 	data: {name: login, password: pass},
		// 	success: requestFunc,
		// 	error: showError,
		// 	dataType: 'json'
		// });
	};

	my.get = function (prop) {
		return properties[prop];
	};

	my.sendMessageAll = function (text) {
		socket.emit('messageUserAll', {name: properties.name, text: text}, function () {
			my.updateViewSelfMessage(text);
		})
	};

	my.updateViewSelfMessage = function (text) {
		viewComponent.addMessageChat({name: properties.name, text: text, time: getTime()});
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
		viewComponent.removeUserOnlineList(name);
	};


	return my;
})();