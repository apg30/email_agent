var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
passport.use(new LocalStrategy(models.User.authenticate()));
passport.serializeUser(models.User.serializeUser());
passport.deserializeUser(models.User.deserializeUser());



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
app.post('/register',
	function (req, res) {
		console.log("username : " + req.body.username);
		var password = req.body.password;
		console.log("password : " + password);
		models.User.register(new models.User({ username : req.body.username}), password, function(err, account) {
			if (err) {
				console.log("Error : " + err);
				return res.render('login');
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
