var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var iot = require('aws-iot-device-sdk');

var thingShadow = iot.thingShadow({
	keyPath: __dirname+ "/certs/private.pem.key",
    certPath: __dirname+ "/certs/certificate.pem.crt",
    caPath: __dirname+ "/certs/rootCA.pem",
    clientId: "someRandomClientId2893472897",
    region: "us-east-1"
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
	console.log("Request URL: " + req.url);
	res.send("Hello World !");
});

app.get('/api', function(req, res){
	res.send({"id": 5, "name": "Chetan"});
});

app.post('/api', function(req, res){
	console.log(JSON.stringify(req.body));
	var ledSate = {"state":{"desired": {
		"color": "#ff0000"	   }}};

	ledSate.state.desired.color = req.body.ledColor;
	if (req.body.state != null) {
		ledSate.state.desired.state = req.body.state;
	} else {
		ledSate.state.desired.state = "off";
	}
	
	thingShadow.update("MyDevice", ledSate); 
	res.send("success");
});

app.put('/api', function(req, res){
	res.send("updated");
});


app.get('/home', function(req, res){
	res.sendFile(__dirname + "/views/home.html");
});


var server = app.listen(8585, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	
	thingShadow.register("MyDevice", {
		//ignoreDeltas: true
	 });
	
	console.log("Example app listening at http://%s:%s", host, port)
});