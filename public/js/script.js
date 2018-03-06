function writeText(texts) {
	$('#room ul').append($('<li>').text(texts));
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