var five = require('johnny-five'),
	board = new five.Board(),
	//express = require('express'),
	//app = express(),
	//server = require('http').Server(app),
	//bodyParser = require('body-parser'),
	http = require('http'),
	fs = require('fs'),
	index = fs.readFileSync('./public/index.html'),
	server = http.createServer(function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
  		res.end(index);
	}),
	EventEmitter = require('events').EventEmitter,
	emitter = new EventEmitter(),
	request = require('request'),
	WebSocketClient = require('websocket').client,
	client = new WebSocketClient(),
	port = 8080,
	led,
	btn1,
	btn2,
	btn3,
	btn4,
	btn5,
	toggleState = false,
	requestMade = false;

//app.use(bodyParser.json());

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
       	console.log('Message received of ', message);
    });
});

//client.connect('ws://stream.pushbullet.com/websocket/K1DkJ3YHXVAysRNiQPPzFrceWYazy88e');
//client.connect('ws://echo.websocket.org/');
client.connect('ws://ws.blockchain.info/inv');

board.on('ready', function() {
	console.log('Board ready');
	led = new five.Led.RGB([11,10,9]);
	btn1 = new five.Button(7);
	btn2 = new five.Button(6);
	btn3 = new five.Button(5);
	btn4 = new five.Button(4);
	btn5 = new five.Button(3);

	led.color('#ff6600');

	btn1.on('down', function(value) {
		console.log('BUTTON 1');
		led.color('#00ff00');
		
		emitter.emit('notify');
	});

	btn2.on('down', function(value) {
		console.log('BUTTON 2');
		led.color('#ff0000');
	});

	btn3.on('down', function(value) {
		led.color('#0000ff');
	});

	btn4.on('down', function(value) {
		led.color('#ff00ff');
	});

	btn5.on('down', function(value) {
		led.color('#ffff00');
	});

	setInterval(toggleLED, 200);

	function toggleLED() {
		
	}
});

emitter.on('notify', function() {
	console.log('Nofified!');

	request.post({
		url: 'https://api.pushbullet.com/v2/pushes',
		json: true,
		auth: {
			bearer: 'K1DkJ3YHXVAysRNiQPPzFrceWYazy88e'
		},
		body: {
			email: 'pcatanzariti@gmail.com',
			type: 'note',
			title: 'I love Meri <3',
			body: 'I love Meri super duper lots and lots'
		}
	}, function(error, response, body) {
		//console.log('Body response was ', body);
		requestMade = false;
	});
});

server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});