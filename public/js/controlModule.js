chat.control = (function () {
	let my = {};
	let modelComponent;
	let domField;
	let textMessage;

	my.init = function (model, field) {
		modelComponent = model;
		domField = field;
		textMessage = ($('#inputField .inputField__inputUserMessage', field))[0];

		let buttonSend = ($('#inputField .inputField__buttonSend', field))[0];
		buttonSend.addEventListener('click', my.sendMessage);
		let buttonLogIn = ($('#checkIn .checkIn__button', field))[0];
		buttonLogIn.addEventListener('click', my.checkIn);
		let SowListOnline = ($('#listUsers', field))[0];
		SowListOnline.addEventListener('click', my.showListOnline);
	};

	my.sendMessage = function () {
		modelComponent.sendMessageAll(textMessage.value);
		// console.log(textMessage.value);
		textMessage.value = '';
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