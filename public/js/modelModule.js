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
		showListOnline: false
	};

	my.init = function (view) {
		viewComponent = view;
	};

	my.checkUser = function (login, pass) {
		$.ajax({
			type: "POST",
			url: '/access',
			data: {name: login, password: pass},
			success: requestFunc,
			error: showError,
			dataType: 'json'
		});
	};

	function requestFunc(data) {
		// console.log(data);
		if ( data.access ) {
			let socketIo = io();
			socket = socketIo;
			socketIo.on('messagePublic', function (data) {
				my.updateViewUserMessage(data);
			});
			// socketIo.on('messagePublic', function (data) {
			// 	self.updateViewUserMessage(data);
			// });
			properties.registration = true;
			properties.name = data.name;
			my.updateViewComponent();
		} else {
			properties.error = true;
			my.updateViewComponent();
		}
	}

	function showError() {
		console.log(arguments);
		alert('Ошибка сервера');
	}

	my.get = function (prop) {
		return properties[prop];
	};

	my.sendMessageAll = function (text) {
		socket.emit('messageUserAll', {name: properties.name, text: text}, function (time) {
			my.updateViewSelfMessage(text, time);
		})
	};

	my.updateViewSelfMessage = function (text, time) {
		viewComponent.addMessageChat({name: properties.name, text: text, time: time});
	};
	my.updateViewUserMessage = function (data) {
		viewComponent.addMessageChat(data);
	};

	my.updateViewComponent = function () {
		viewComponent.updateView();
	};

	my.showListOnline = function () {
		properties.showListOnline = !properties.showListOnline;
		my.updateViewComponent();
	};


	return my;
})();