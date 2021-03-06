chat.view = (function () {
	let my = {};
	let modelComponent;
	let domField;
	let wrapperMessageField;
	let nameRoom;
	let checkIn;
	let error;
	let onlineList;
	let sourceTemplateMe = document.getElementById('message-am-template').innerHTML;

	let sourceTemplateUser = document.getElementById('message-user-template').innerHTML;

	let sourceTemplateUserOnline = document.getElementById('user_online').innerHTML;
	let sourceTemplateMessageField = document.getElementById('message_field').innerHTML;

	function hideNotification(name) {
		$('#listUsers .listUsers__userOnline.' + name + ' .listUsers__notification').hide();
		$('#lableField .lableField__notific').removeClass('lableField__notific-show');
	}

	my.updatePrivateField = function () {
		let usersField = (modelComponent.get('userOnline')).slice();
		usersField.push('publicChat');
		let currentField = modelComponent.get('nameRoom');
		for ( let i = 0; i < usersField.length; i++ ) {
			let field = usersField[i];
			if ( field === currentField ) {
				$('#wrapperMessageField .messageField.' + field).removeClass('opacityFieldMessage');
			} else {
				$('#wrapperMessageField .messageField.' + field).addClass('opacityFieldMessage');
			}
		}
		hideNotification(currentField);
	};

	my.init = function (model, field) {
		modelComponent = model;
		domField = field;
		wrapperMessageField = ($('#wrapperMessageField'))[0];
		nameRoom = ($('#lableField .lableField__nameChat', field))[0];
		checkIn = ($('#checkIn', field))[0];
		error = $('#checkIn .checkIn__error', field)[0];
		onlineList = ($('#listUsers', field))[0];
	};

	my.addMessageChat = function (json) {
		//console.log(json);  //{name: "w", text: "w", room: "Public chat", time: "19:35"}
		let messageField = ($('#wrapperMessageField .messageField.' + json.room))[0];
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
		let name = modelComponent.get('nameRoom');
		if ( name === "publicChat" ) {
			$(nameRoom).text('Public chat');
		} else {
			$(nameRoom).text(name);
		}

		if ( modelComponent.get('registration') ) {
			$(checkIn).hide("explode");
			$('#inputField .inputField__inputUserMessage').focus();
		}
		if ( modelComponent.get('error') ) {
			$(error).show();
		}
		if ( modelComponent.get('showListOnline') ) {
			$(onlineList).addClass('listUsersSow');
		} else {
			$(onlineList).removeClass('listUsersSow');
		}
		;
	};

	my.updateUsersOnlineList = function () {
		let users = modelComponent.get('userOnline');
		for ( let i = 0; i < users.length; i++ ) {
			my.addUserOnlineList(users[i]);
		}
	};

	my.addUserOnlineList = function (name) {
		let templateUser = Handlebars.compile(sourceTemplateUserOnline);
		let element = templateUser({name: name});
		$(onlineList).append(element);

		let templateMessageField = Handlebars.compile(sourceTemplateMessageField);
		let elementField = templateMessageField({room: name});
		$(wrapperMessageField).append(elementField);
		$('#wrapperMessageField .messageField:last-child').addClass('opacityFieldMessage');
		// console.log($('#wrapperMessageField .messageField:last-child'));
	};

	my.removeUserOnlineList = function (name) {
		$('#listUsers .listUsers__userOnline.' + name).remove();
		$('#wrapperMessageField .messageField.' + name).remove();
	};

	my.showNotification = function (data) {
		//console.log(data);//{name: "second", text: "a", room: "second", time: "19:43"}
		if ( modelComponent.get('nameRoom') !== data.name ) {
			$('#listUsers .listUsers__userOnline.' + data.name + ' .listUsers__notification').show();
			$('#lableField .lableField__notific').addClass('lableField__notific-show');
		}
	};
	my.vibro = function (val) {
		if ( "vibrate" in navigator ) return navigator.vibrate(val);
		if ( "oVibrate" in navigator ) return navigator.oVibrate(val);
		if ( "mozVibrate" in navigator ) return navigator.mozVibrate(val);
		if ( "webkitVibrate" in navigator ) return navigator.webkitVibrate(val);
	}


	return my;
})();