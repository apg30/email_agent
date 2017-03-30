// routes.js
// ========

var passport = require('passport');
var models = require('./models');
var smtp = require('./smtp');
//var ObjectID = require('mongodb').ObjectID;

module.exports = function (app) {
	app.post('/register',
		function (req, res) {
			var password = req.body.password;

			//Create settings for user
			var settings = new models.Settings({
				 background_change: false
			 });
			settings.save(function (err, s) {
			  if (err) {
				  return handleError(err);
			  }
			  // saved!
		  	});

			models.User.register(new models.User({
				email: req.body.email,
				username : req.body.username,
				settings: settings
			}), password, function(err, account) {
				if (err) {
					console.log("Error : " + err);
					req.flash("info", "Error registering");
					return res.render('login');
				}

				console.log('User saved successfully!');
				passport.authenticate('local')(req, res, function () {
					req.flash("info", "User registered succesfully");
					res.redirect('/');
				});
			});
		}
	);

	/* Handle SMTP delivery protocol requests */
	app.post('/smtp_send',
		function handler(req, res) {
			//Ensure client is on HW network.
			var post_params = req.body;
			console.log(post_params);
			smtp.send_email(post_params, res);
			req.flash("info", "Email Sent");
			res.redirect('/');
		}
	);

	app.get('/',
	  require('connect-ensure-login').ensureLoggedIn(),
	  function(req, res) {
		res.render('index', {
			user: req.user,
			messages: req.flash()
		});
	  });

	app.get('/login',
	  function(req, res){
		res.render('login', {
			messages: req.flash()
		});
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
		res.render('profile', {
			user: req.user,
			messages: req.flash()
		});
	  });

	app.get('/settings',
		//Ensures user is logged in
		require('connect-ensure-login').ensureLoggedIn(),
		function(req, res){
			//Finds the user settings to display in settings form
			models.Settings.findOne({_id:req.user.settings}, function(error, s) {
				if (error) {
					return handleError(error);
				}

				res.render('settings', {
					user: req.user,
					settings: s.toObject(),
					messages: req.flash()
				});
			});
		}
	);

	//Saves settings form data to MongoDB
	app.post('/settings',
		require('connect-ensure-login').ensureLoggedIn(),
		function(req, res){
			//Passes form data to mongoose to update the database
			models.Settings.findOneAndUpdate({_id:req.user.settings}, req.body, {upsert:true}, function(err, doc){
			    if (err) return res.send(500, { error: err });
				req.flash('info', 'Settings saved successfully');
			    res.status(200).redirect("/settings");
			});
		}
	);

	app.get('/about',
		function(req, res){
		res.render('about', {
			user: req.user,
			messages: req.flash()
		});
	});

};
