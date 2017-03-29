// routes.js
// ========

var passport = require('passport');
var models = require('./models');
var config = require("../config.js");
var pop3c = require("./pop3.js");
var pop3_callbacks = require("./pop3_callbacks.js")(pop3c);
var db = require("./db.js");

const simpleParser = require('mailparser').simpleParser;
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
	app.post('/you_watt_smtp',
		function handler(request, response) {
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
		}
	);

	/* Fetch ALL emails from POP3 server and place in */
	app.get('/pop3_fetch',
		require('connect-ensure-login').ensureLoggedIn(),
		function handler(req, res) {
			//Connects to the server and logs in the user
			pop3c.connect(config.pop3_username,
				config.pop3_password,
				config.pop3_host,
				config.pop3_port
			);

			pop3c.login(config.pop3_username,
				config.pop3_password
			);

			pop3c.set_user_id(req.user.id);

			pop3c.set_stat_callback(pop3_callbacks.stat);
			pop3c.set_login_callback(pop3_callbacks.login);
			pop3c.set_list_callback(pop3_callbacks.list);
			pop3c.set_retr_callback(pop3_callbacks.retr);

		}
	);

	/* Return ALL emails from database */
	app.get('/db_emails',
		require('connect-ensure-login').ensureLoggedIn(),
		function handler(req, res) {
			models.Message.find({creator: req.user.id})
			.exec(function (err, emails) {
			  if (err) return handleError(err);
				res.setHeader('Content-Type', 'application/json');
	    	res.send(JSON.stringify(emails));
			});
		}
	);

	/*	Return ALL emails from database
			This is the data displayed on teh inbox page.
			We only need to, from, subject, part of the text*/
	app.get('/inbox',
		require('connect-ensure-login').ensureLoggedIn(),
		function handler(req, res) {
			models.Message.find({creator: req.user.id, mailbox: "inbox"}, "to_emails cc_emails bcc_emails subject", function(err, messages){
				if (err) return handleError(err);
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(messages));
			});
		}
	);

	/* Return ALL emails from database */
	app.get('/db_email_create',
		require('connect-ensure-login').ensureLoggedIn(),
		function handler(req, res) {

			var message = new models.Message({
				to_emails: ['test@tets.com'],
				cc_emails: [],
				bcc_emails: [],
				subject: "Test Subject",
				content: "Test content",
				creator: req.user.id,
				html: "Test html",
				raw_content: "Raw content",
				mailbox: 'inbox'
			});
			message.save(function (err) {
			  if (err) {
			    console.log(err);
			  } else {
			    console.log('meow');
			  }
			});



		}
	);

	app.get('/',
	  require('connect-ensure-login').ensureLoggedIn(),
	  function(req, res) {
			models.Message
			.find({creator: req.user.id, mailbox: "inbox"})
			.select("date from_emails to_emails cc_emails bcc_emails subject html")
			.limit(50)
			.sort('date')
			.exec(function(err, inbox){
				if (err) return handleError(err);
				res.render('index', {
					user: req.user,
					messages: req.flash(),
					inbox: inbox
				});
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
