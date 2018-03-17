chat.view = (function () {
	let my = {};
	let modelComponent;
	let domField;
	let messageField;
	let nameRoom;
	let checkIn;
	let error;
	let onlineList;
	let sourceTemplateMe = document.getElementById('message-am-template').innerHTML;

	let sourceTemplateUser = document.getElementById('message-user-template').innerHTML;

	let sourceTemplateUserOnline = document.getElementById('user_online').innerHTML;


	my.init = function (model, field) {
		modelComponent = model;
		domField = field;
		messageField = ($('.messageField', field))[0];
		nameRoom = ($('#lableField .lableField__nameChat', field))[0];
		checkIn = ($('#checkIn', field))[0];
		error = $('#checkIn .checkIn__error', field)[0];
		onlineList = ($('#listUsers .listUsers__userOnlineList', field))[0];
	};

	my.addMessageChat = function (json) {
		// console.log(json);
		let element;
		if ( json.name === modelComponent.get('name') ) {
			let templateMe = Handlebars.compile(sourceTemplateMe);
			element = templateMe(json);
			$(messageField).append(element);
		} else {
			let templateUser = Handlebars.compile(sourceTemplateUser);
			element = templateUser(json);
			$(messageField).append(element);
		}
		messageField.scrollIntoView(false);
	};
	my.updateView = function () {
		$(nameRoom).text(modelComponent.get('nameRoom'));
		if ( modelComponent.get('registration') ) {
			$(checkIn).hide();
		}
		if ( modelComponent.get('error') ) {
			$(error).show();
		}
		if ( modelComponent.get('showListOnline') ) {
			$(onlineList).addClass('listUsersSow');
		} else {
			$(onlineList).removeClass('listUsersSow');
		}
	};

	my.updateUsersOnlineList= function () {
		let users = modelComponent.get('userOnline');
		for(let i = 0; i < users.length; i++){
			my.addUserOnlineList(users[i]);
		}
	};

	my.addUserOnlineList = function (name) {
		let templateUser = Handlebars.compile(sourceTemplateUserOnline);
		let element = templateUser({name: name});
		$(onlineList).append(element);
	};

	my.removeUserOnlineList = function (name) {
		$('#listUsers .listUsers__userOnline.' + name).remove();
	};



	return my;
})();