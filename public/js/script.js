// $.ajax({
// 	type: "POST",
// 	url: 'access',
// 	data: {userName: 'Igor', userPassword: 1234},
// 	success: successs,
// 	dataType: 'json'
// });
//
// function successs(data) {
// 	// console.log(data);
// }


// var socket = io();
// socket.on('message', function (data) {
// 	//console.log(data);
// 	writeText(data.text);
// });


// key.addEventListener('click', function (event) {
// 	var textInput = document.getElementById('text');
// 	var text = textInput.value;
// 	textInput.value = '';
// 	socket.emit('messageUser', {text: text}, function (time) {
// 		writeText(text + ' ' + time);
// 	});
//
//
// });
//
// function writeText(texts) {
// 	$('#room ul').append($('<li>').text(texts));
// }

const FIELD = ($('#chatWrapper'))[0];
let controlChat = new ChatController();
let viewChat = new ChatView();
let modelChat = new ChatModel();

modelChat.start(viewChat);
controlChat.start(modelChat, FIELD);
viewChat.start(modelChat, FIELD);
viewChat.updateView();


//                          Control                        //  Control  //

function ChatController() {
	let modelComponent;
	let domField;
	let textMessage;

	this.start = function (model, field) {
		modelComponent = model;
		domField = field;
		textMessage = ($('#inputField .inputField__inputUserMessage', domField))[0];

		let buttonSend = ($('#inputField .inputField__buttonSend', field))[0];
		buttonSend.addEventListener('click', this.sendMessage);
		let buttonLogIn = ($('#checkIn .checkIn__button', field))[0];
		buttonLogIn.addEventListener('click', this.checkIn);
		let SowListOnline = ($('#listUsers', field))[0];
		SowListOnline.addEventListener('click', this.showListOnline);
	};

	this.sendMessage = function () {
		modelComponent.sendMessageAll(textMessage.value);
		// console.log(textMessage.value);
		textMessage.value = '';
		textMessage.focus();
	};

	this.checkIn = function () {
		let login = ($('#checkIn .checkIn__login', domField))[0];
		let password = ($('#checkIn .checkIn__password', domField))[0];
		modelComponent.checkUser(login.value, password.value);
		// login.value = '';
		password.value = '';
	};
	this.showListOnline = function () {
		modelComponent.showListOnline();
	};
}

//                          Model                          //  Model  //

function ChatModel() {
	let self = this;
	let viewComponent;
	let socket;
	let properties = {
		registration: false,
		error: false,
		name: 'Igor',
		nameRoom: 'LogIn',
		showListOnline: false
	};

	this.start = function (view) {
		viewComponent = view;
	};

	this.checkUser = function (login, pass) {
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
		if(data.access){
			let socketIo = io();
			socket = socketIo;
			socketIo.on('messagePublic', function (data) {
				self.updateViewUserMessage(data);
			});
			// socketIo.on('messagePublic', function (data) {
			// 	self.updateViewUserMessage(data);
			// });
			properties.registration = true;
			properties.name = data.name;
			self.updateViewComponent();
		}else {
			properties.error = true;
			self.updateViewComponent();
		}
	}

	function showError() {
		console.log(arguments);
		alert('Ошибка сервера');
	}

	this.get = function (prop) {
		return properties[prop];
	};

	this.sendMessageAll = function (text) {
		socket.emit('messageUserAll', {name: properties.name, text: text}, function (time) {
			self.updateViewSelfMessage(text, time);
		})
	};

	this.updateViewSelfMessage = function (text, time) {
		viewComponent.addMessageChat({name: properties.name, text: text, time: time});
	};
	this.updateViewUserMessage = function (data) {
		viewComponent.addMessageChat(data);
	};

	this.updateViewComponent = function () {
		viewComponent.updateView();
	};

	this.showListOnline = function () {
		properties.showListOnline = !properties.showListOnline;
		self.updateViewComponent();
	}
}

//                          View                          //  View    //

function ChatView() {
	let modelComponent;
	let domField;
	let messageField;
	let nameRoom;
	let checkIn;
	let error;
	let onlineList;
	let sourceTemplateMe = document.getElementById('message-am-template').innerHTML;

	let sourceTemplateUser = document.getElementById('message-user-template').innerHTML;

	let sourceTemplateUserOnline = document.getElementById('message-am-template').innerHTML;
	let templateUserOnline = Handlebars.compile(sourceTemplateUserOnline);


	this.start = function (model, field) {
		modelComponent = model;
		domField = field;
		messageField = ($('#messageField', field))[0];
		nameRoom = ($('#lableField .lableField__nameChat', field))[0];
		checkIn = ($('#checkIn', field))[0];
		error = $('#checkIn .checkIn__error', field)[0];
		onlineList = ($('#listUsers', field))[0];
	};

	this.addMessageChat = function (json) {
		console.log(json);
		if ( json.name === modelComponent.get('name') ) {
			let templateMe = Handlebars.compile(sourceTemplateMe);
			$(messageField).append(templateMe(json));
		} else {
			let templateUser = Handlebars.compile(sourceTemplateUser);
			$(messageField).append(templateUser(json));
		}
	}
	this.updateView = function () {
		$(nameRoom).text(modelComponent.get('nameRoom'));
		if(modelComponent.get('registration')){
			$(checkIn).hide();
		}
		if(modelComponent.get('error')) {
			$(error).show();
		}
		if(modelComponent.get('showListOnline')){
			$(onlineList).addClass('listUsersSow');
		}else {
			$(onlineList).removeClass('listUsersSow');
		}
	}
}




















