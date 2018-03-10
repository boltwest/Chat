$.ajax({
	type: "POST",
	url: 'access',
	data: {userName: 'Igor', userPassword: 1234},
	success: successs,
	dataType: 'json'
});

function successs(data) {
	console.log(data);
}


var socket = io();
socket.on('message', function (data) {
	console.log(data);
	writeText(data.text);
});


key.addEventListener('click', function (event) {
	var textInput = document.getElementById('text');
	var text = textInput.value;
	textInput.value = '';
	socket.emit('messageUser', {text: text}, function (time) {
		writeText(text + ' ' + time);
	});


});

function writeText(texts) {
	$('#room ul').append($('<li>').text(texts));
}

const FIELD = $('#chatWrapper');
let controlChat = new ChatController();
let viewChat = new ChatView();
let modelChat = new ChatModel();

controlChat.start(modelChat, FIELD);
viewChat.start(modelChat, FIELD);
modelChat.start(viewChat);






//                          Control                        //  Control  //

function ChatController() {
	let modelComponent;
	let domField;
	let textMessage = ($('#inputField .inputField__inputUserMessage', domField))[0];

	this.start = function (model, field) {
		modelComponent = model;
		domField = field;
		let buttonSend = ($('#inputField .inputField__buttonSend', field))[0];
		buttonSend.addEventListener('click', this.sendMessage);
	}
	this.sendMessage = function () {
		modelComponent.sendMessageAll(textMessage.value);
		console.log(textMessage.value);
		textMessage.value = '';
		textMessage.focus();
	}
}

//                          Model                          //  Model  //

function ChatModel() {
	let self = this;
	let viewComponent;
	let registration = false;
	let name = 'igor';

	this.start = function (view) {
		viewComponent = view;
	};

	socket.on('messagePublic', function (data) {
		self.updateViewUserMessage(data);
	});
	
	this.sendMessageAll = function (text) {
		socket.emit('messageUserAll', {name: name, text: text}, function (time) {
			self.updateViewSelfMessage(text, time);
		})
	};

	this.updateViewSelfMessage = function (text, time) {
		viewComponent.addMessageChat({name: name, text: text, date: time});
	};
	this.updateViewUserMessage = function (data) {
		viewComponent.addMessageChat(data);
	};

	this.getName = function () {
		return name;
	}
}

//                          View                          //  View    //

function ChatView() {
	let modelComponent;
	let domField;
	let messageField;
	let sourceTemplateMe = document.getElementById('message-am-template').innerHTML;

	let sourceTemplateUser = document.getElementById('message-am-template').innerHTML;

	let sourceTemplateUserOnline = document.getElementById('message-am-template').innerHTML;
	let templateUserOnline = Handlebars.compile(sourceTemplateUserOnline);


	this.start = function (model, field) {
		modelComponent = model;
		domField = field;
		messageField = ($('#messageField', field))[0];
		// console.log(messageField);
	};

	this.addMessageChat = function (json) {
		if(json.name === modelComponent.getName()){
			let templateMe = Handlebars.compile(sourceTemplateMe);
			$(messageField).append(templateMe(json));
		}else {
			let templateUser = Handlebars.compile(sourceTemplateUser);
			$(messageField).append(templateUser(json));
		}
	}
}




















