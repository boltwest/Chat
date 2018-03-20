chat.control = (function () {
	let my = {};
	let modelComponent;
	let domField;
	let textMessage;

	function checkKeyPressMessage(event) {
		if(event.keyCode === 13){
			if(!event.shiftKey) {
				my.sendMessage();
				event.preventDefault();
			}
		}
	}

	function checkKeyPress(event) {
		if(event.keyCode === 13){
			my.checkIn();
		}
	}

	my.init = function (model, field) {
		modelComponent = model;
		domField = field;
		textMessage = ($('#inputField .inputField__inputUserMessage', field))[0];
		textMessage.addEventListener('keydown', checkKeyPressMessage);
		let buttonSend = ($('#inputField .inputField__buttonSend', field))[0];
		buttonSend.addEventListener('click', my.sendMessage);
		let buttonLogIn = ($('#checkIn .checkIn__button', field))[0];
		buttonLogIn.addEventListener('click', my.checkIn);
		let inputPasswordField = ($('#checkIn .checkIn__password', field))[0];
		inputPasswordField.addEventListener('keydown', checkKeyPress);
		let SowListOnline = ($('#listUsers', field))[0];
		SowListOnline.addEventListener('click', my.showListOnline);
	};

	my.sendMessage = function () {
		if(textMessage.value !== '') {
			modelComponent.sendMessage(textMessage.value);
			// console.log(textMessage.value);
			textMessage.value = '';
			textMessage.focus();
			return;
		}
		textMessage.focus();
	};

	my.checkIn = function () {
		let login = ($('#checkIn .checkIn__login', domField))[0];
		let password = ($('#checkIn .checkIn__password', domField))[0];
		modelComponent.checkUser(login.value, password.value);
		// login.value = '';
		password.value = '';
	};
	my.showListOnline = function (event) {
		let elem = event.target;
		let name = $(elem).attr('data-name');
		if(name){
			modelComponent.selectPrivateRoom(name);
		};
		modelComponent.showListOnline();
	};
	return my;
})();