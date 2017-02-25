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
var http2 = require('./lib/http');
var db = require('./lib/db');
var models = require('./lib/models');

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(multer({dest:'./uploads/'}).array('multiInputFileName'));

var conn = db.init("hamish", "abchamish354", "mongo-server-1", 27017);
var db = conn.db;

//var user_collection = db.collection(conn, "you_watt_users");
var mystore = null;
conn.once('open', function() { 
  console.log('Connected to YouWatt MongoDB database') 
  //conn.db.collection("you_watt_users", function(err, coll) { mystore = coll; });
});

//test
//var user_collection = conn.db.collection("you_watt_users");



models.User.find({}, function(err, users) {
	if (err){
		if ( err.code === 11000 ) {
			//req.flash('error', 'User already exists');
			//res.redirect('/signup');
			console.log("User already exists");
			return;
		} else {
			console.log(err);
			console.log(err.code);
		}
	} 

  // object of all the users
  console.log(users);
});

app.post('/register', function handler(request, response) {
	var post_params = request.body;

	var new_user = models.User({
		username: post_params["username"],
		password: post_params["password"]
	});

	new_user.save(function(err) {
	  if (err) throw err;

	  console.log('User saved successfully!');
	  response.redirect(http2.root + "index.shtml");
	});
});


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
