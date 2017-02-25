var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer({dest:'./uploads/'}).array('multiInputFileName'));// for parsing multipart/form-data

//User created libraries
var smtp = require('./lib/smtp');
var html = require('./lib/html');
console.log("Libraries loaded");


app.post('/you_watt_smtp', function handler(request, response) {
	//Ensure client is on HW network.
	if (request.ip.indexOf("137.195.") == -1 ) {
		try {
			response.send(html.head + "outside hw.ac.uk" + html.tail);
		} catch (exc) {};
		return;
	}
	
	console.log("Handling SMPT request:");
	var post_params = request.body;
	console.log(post_params);
	

	if(post_params["action"] == "send"){
		console.log("Sending email");
		smtp.send_email(post_params, response);
	} else {
		response.send(html.head + "Invalid action" + html.tail)
	}
	console.log("SMPT request done");
});

var svr = http.createServer(app);
svr.on('error', function(err) {console.log('Server: ' + err);});
svr.listen(8001, function() {console.log("server runs on cantor");});
