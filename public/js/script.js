const FIELD = ($('#chatWrapper'))[0];

chat.model.init(chat.view);
chat.view.init(chat.model, FIELD);
chat.control.init(chat.model, FIELD);
chat.view.updateView();