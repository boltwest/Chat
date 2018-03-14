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

	let sourceTemplateUserOnline = document.getElementById('message-am-template').innerHTML;
	let templateUserOnline = Handlebars.compile(sourceTemplateUserOnline);


	my.init = function (model, field) {
		modelComponent = model;
		domField = field;
		messageField = ($('#messageField', field))[0];
		nameRoom = ($('#lableField .lableField__nameChat', field))[0];
		checkIn = ($('#checkIn', field))[0];
		error = $('#checkIn .checkIn__error', field)[0];
		onlineList = ($('#listUsers', field))[0];
	};

	my.addMessageChat = function (json) {
		// console.log(json);
		if ( json.name === modelComponent.get('name') ) {
			let templateMe = Handlebars.compile(sourceTemplateMe);
			$(messageField).append(templateMe(json));
		} else {
			let templateUser = Handlebars.compile(sourceTemplateUser);
			$(messageField).append(templateUser(json));
		}
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
	return my;
})();