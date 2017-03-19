// routes.js
// ========

var passport = require('passport');
var models = require('./models');

module.exports = function (app) {
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
};
