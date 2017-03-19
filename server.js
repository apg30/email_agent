var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

//Import user created libraries
var smtp = require('./lib/smtp');
var html = require('./lib/html');
var http2 = require('./lib/http');
var db = require('./lib/db');
var models = require('./lib/models');

// datebase connection
var conn = db.init("cac30", "abccac30354", "mongo-server-1", 27017);
var db = conn.db;
conn.once('open', function() { 
  console.log('Connected to YouWatt MongoDB database') 
});


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
	function(username, password, cb) {
		models.User.findOne({ username: username }, function(err, user) {
			console.log(user);
			console.log("User id: " + user.id);
			if (err) {
				console.log('Error: ' + err);
				return cb(err);
			}
			if (!user) {
				console.log("NOt user?");
				return cb(null, false);
			}
			if (user.password != password) {
				console.log("Password incorrect");
				return cb(null, false);
			}
			console.log("Success loggin in!");
			return cb(null, user);
		});
 }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
	models.User.findOne({ id: id }, function (err, user) {
		if (err) {
			console.log("Error deserialising!");
			return cb(err);
		}
		console.log("Success deserialising!");
		cb(null, user);
	});
});




// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public_html'));

// Define routes.
app.post('/register', function handler(req, res) {
	var post_params = req.body;

	var new_user = models.User({
		username: post_params["username"],
		password: post_params["password"]
	});

	new_user.save(function(err) {
	  if (err){
		  console.log('Failed: ' + err);
		  return res.render("login", {info: "Sorry. That username already exists. Try again."});
		}

	  console.log('User saved successfully!');
	  passport.authenticate('local')(req, res, function () {
            res.redirect('/');
          });
	});
});

app.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    res.render('index', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });
  
app.get('/settings',
	require('connect-ensure-login').ensureLoggedIn(),
	function(req, res){
	res.render('settings', { user: req.user });
});

app.get('/about',
	function(req, res){
	res.render('about', { user: req.user });
});

app.listen(3000);
