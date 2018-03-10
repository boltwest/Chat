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
	socket.emit('messageUser', {text: text}, function () {
		writeText(text);
	});


});

function writeText(texts) {
	$('#room ul').append($('<li>').text(texts));
}

const FIELD = $('#chatWrapper');
let controlChat = new ChatController();
controlChat.start(null, FIELD);



let messageObject = {
	name: 'Boba',
	text: 'lorem10',
	date: '23:18'
};
let templateUser = document.getElementById('message-user-template');

let viewChat = new ChatView();
viewChat.start(null, FIELD);
viewChat.addMessageUsers(messageObject, templateUser);



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
		console.log(textMessage.value);
		textMessage.value = '';
		textMessage.focus();
	}
}

//                          Model                          //  Model  //

function ChatModel() {
	let viewComponent;
	let registration = false;

	this.start = function (view) {
		viewComponent = view;
	}
}

//                          View                          //  View    //

function ChatView() {
	let modelComponent;
	let domField;
	let messageField;
	let messageObject = {
		name: 'Boba',
		text: 'lorem10',
		date: '23:18'
	};

	this.start = function (model, field) {
		modelComponent = model;
		domField = field;
		messageField = ($('#messageField', field))[0];
		// console.log(messageField);
	};

	this.addMessageUsers = function (json, userTemplate) {
		let template = Handlebars.compile($(userTemplate).html());
		$(messageField).append(template(json));
	}
}




















