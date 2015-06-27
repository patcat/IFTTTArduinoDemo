var five = require('johnny-five'),
	board = new five.Board(),
	express = require('express'),
	app = express(),
	server = require('http').Server(app),
	bodyParser = require('body-parser'),
	request = require('request'),
	port = 8080,
	led,
	btn;

app.use(bodyParser.json());

board.on('ready', function() {
	console.log('Board ready');

	btn = new five.Button(7);
	led = new five.Led.RGB([11,10,9]);

	led.color('#ffffff');

	btn.on('down', function(value) {
		console.log('Light toggle pressed.');
		
		request.post({
			url: 'http://maker.ifttt.com/trigger/light_switch/with/key/{{your-key-here}}'
		}, function(error, response, body) {
			console.log('Body response was ', body);
			console.log('Error was ', error);
		});
	});
});

app.post('/led', function (req, res) {
	var response = req.body;

	led.color(response.color);
	res.send('LED request successful!');
});

server.listen(port, function() {
    console.log('Server is listening on port ' + port);
});