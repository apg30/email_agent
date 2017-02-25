/* This is the main Node.js file, start using `node you_watt.js`.
 * Authors: Cameron A. Craig, Stuart J. Thain, Aidan P. Gallagher, Lee A. Hamilton
 * Date: 25/02/2016
 */

//Import required npm libraries
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var app = express();

//Import user created libraries
var smtp = require('./lib/smtp');
var html = require('./lib/html');

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(multer({dest:'./uploads/'}).array('multiInputFileName'));


/* Handle SMTP delivery protocol requests */
app.post('/you_watt_smtp', function handler(request, response) {
	//Ensure client is on HW network.
	if (request.ip.indexOf("137.195.") == -1 ) {
		try {
			response.send(html.head + "outside hw.ac.uk" + html.tail);
		} catch (exc) {};
		return;
	}
	
	var post_params = request.body;
	console.log(post_params);
	

	if(post_params["action"] == "send"){
		smtp.send_email(post_params, response);
	} else {
		response.sendStatus(500);
	}
});

/* Start the server application */
var svr = http.createServer(app);
svr.on('error', function(err) {console.log('Server: ' + err);});
svr.listen(8001, function() {console.log("YouWatt server running on amaterasu (hopefully)");});
