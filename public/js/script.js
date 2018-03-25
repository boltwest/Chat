if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js').then(function(reg) {
		// регистрация сработала
		console.log('Registration succeeded. Scope is ' + reg.scope);
	}).catch(function(error) {
		// регистрация прошла неудачно
		console.log('Registration failed with ' + error);
	});
};

const FIELD = ($('#chatWrapper'))[0];
chat.model.init(chat.view);
chat.view.init(chat.model, FIELD);
chat.control.init(chat.model, FIELD);
chat.view.updateView();