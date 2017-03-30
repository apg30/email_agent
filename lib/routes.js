// routes.js
// ========

var passport = require('passport');
var models = require('./models');
var config = require("../config.js");
var pop3c = require("./pop3.js");
var pop3_callbacks = require("./pop3_callbacks.js")(pop3c, models);
var db = require("./db.js");

var smtp = require('./smtp');
var config = require('../config');
//var ObjectID = require('mongodb').ObjectID;

module.exports = function (app) {

/*******************************************************************************
******************************* User Auth Routes *******************************
*******************************************************************************/
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

app.get('/login',
	function(req, res){
	res.render('login', {
		messages: req.flash(),
		port: config.chat_port
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

/*******************************************************************************
********************************** SMTP Routes *********************************
*******************************************************************************/

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

/*******************************************************************************
********************************** POP3 Routes *********************************
*******************************************************************************/

	/* Fetch ALL emails from POP3 server and place in */
	app.get('/pop3_retr',
		require('connect-ensure-login').ensureLoggedIn(),
		function handler(req, res) {
			//Get POP3 settings to connect to POP3 server
			models.Settings
				.findOne({_id:req.user.settings})
				.select("pop3_username pop3_password pop3_host pop3_port")
				.exec(function(error, settings) {
					if (error) return handleError(error);
					console.log(settings);
					if(typeof req.query.number != 'undefined'){
						pop3_callbacks.set_retr_amount(req.query.number);
					}
					pop3_callbacks.set_user_id(req.user.id);
					//Connects to the server and logs in the user
					pop3c.connect(settings.pop3_host,settings.pop3_port);
					console.log("Logging in with " +settings.pop3_username + settings.pop3_password );
					pop3c.login(settings.pop3_username,settings.pop3_password);

					pop3c.set_user_id(req.user.id);

					pop3c.set_stat_callback(pop3_callbacks.stat);
					pop3c.set_login_callback(pop3_callbacks.login);
					pop3c.set_list_callback(pop3_callbacks.list);
					pop3c.set_retr_callback(pop3_callbacks.retr);
				});

				res.redirect("/");
		}
	);

	/* Delete an email from the POP3 server
	   Call like : /pop3_dele?id=<pop3_id>
	*/
	app.get('/pop3_dele',
		require('connect-ensure-login').ensureLoggedIn(),
		function handler(req, res) {
			var dele_id = req.query.id;
			if(typeof dele_id == 'undefined'){
				res.sendStatus(500);
				return;
			}

			function login_callback(success){
				pop3c.dele(dele_id);
			}

			function dele_callback(success){
				pop3c.close();

				if(success){
					//Also remove from database
					models.Message.remove({pop3_id: dele_id})
					.exec(function (err, emails) {
					  if (err) return handleError(err);
						req.flash('info', 'Message deleted');
						res.redirect('/');
					});
					//res.redirect("/");//(200);
				}else{
					res.sendStatus(500);
				}
			}

			models.Settings
				.findOne({_id:req.user.settings})
				.select("pop3_username pop3_password pop3_host pop3_port")
				.exec(function(error, settings) {
					//Connects to the server
					pop3c.connect(settings.pop3_host, settings.pop3_port);

					//Logs in user to POP3 server
					pop3c.login(settings.pop3_username, settings.pop3_password);

					pop3c.set_user_id(req.user.id);

					pop3c.set_login_callback(login_callback);
					pop3c.set_dele_callback(dele_callback);
				});
		}
	);

	/* List ALL email POP3 ids and bytes */
	app.get('/pop3_list',
		require('connect-ensure-login').ensureLoggedIn(),
		function handler(req, res) {
			models.Settings
				.findOne({_id:req.user.settings})
				.select("pop3_username pop3_password pop3_host pop3_port")
				.exec(function(error, settings) {

					//Connects to the server and logs in the user
					pop3c.connect(settings.pop3_host, settings.pop3_port);

					pop3c.login(settings.pop3_username, settings.pop3_password);

					pop3c.set_user_id(req.user.id);

					function login_callback(success){
						pop3c.list();
					}

					function list_callback(json_data){
						pop3c.close();
						res.setHeader('Content-Type', 'application/json');
						res.send(JSON.stringify(json_data));
					}

					pop3c.set_login_callback(login_callback);
					pop3c.set_list_callback(list_callback);

				});



		}
	);

/*******************************************************************************
*********************************** DB Routes **********************************
*******************************************************************************/

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

	/* Delete all message data stored against user */
	app.post('/db_delete_data',
		require('connect-ensure-login').ensureLoggedIn(),
		function handler(req, res) {
			models.Message.remove({creator: req.user.id})
			.exec(function (err, emails) {
			  if (err) return handleError(err);
				req.flash('info', 'All messages have been deleted from our database');
				res.redirect('/');
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

/* Return ALL emails from database */
app.get('/search',
	require('connect-ensure-login').ensureLoggedIn(),
	function handler(req, res) {
		if(typeof req.query.search != "undefined"){
			models.Message
			.find(
				{ $text : { $search : req.query.search }}
			)
			.select("date from_emails to_emails cc_emails bcc_emails subject html pop3_id")
			.limit(50)
			.sort('-date')
			.exec(function(err, search_results){
				if (err) {
					console.log(err);
					return handleError(err);
				}
				//console.log(search_results);
				res.render('index', {
					user: req.user,
					messages: req.flash(),
					inbox: search_results,
					port: config.chat_port
				});
			});
		} else {
			res.render('index', {
				user: req.user,
				messages: req.flash(),
				inbox: []
			});
		}
	}
);

/*******************************************************************************
******************************* Page (GET) Routes *******************************
*******************************************************************************/

	app.get('/',
	  require('connect-ensure-login').ensureLoggedIn(),
	  function(req, res) {
			models.Message
			.find({creator: req.user.id, mailbox: "inbox"})
			.select("date from_emails to_emails cc_emails bcc_emails subject html pop3_id")
			.limit(50)
			.sort('-date')
			.exec(function(err, inbox){
				if (err) return handleError(err);
				res.render('index', {
					user: req.user,
					messages: req.flash(),
					inbox: inbox,
					port: config.chat_port
				});
			});
	  });

		app.get('/sent',
		  require('connect-ensure-login').ensureLoggedIn(),
		  function(req, res) {
				models.Message
				.find({creator: req.user.id, mailbox: "sent"})
				.select("date from_emails to_emails cc_emails bcc_emails subject html pop3_id")
				.limit(50)
				.sort('-date')
				.exec(function(err, sent){
					if (err) return handleError(err);
					res.render('index', {
						user: req.user,
						messages: req.flash(),
						inbox: sent,
						port: config.chat_port
					});
				});
		  });

			app.get('/drafts',
				require('connect-ensure-login').ensureLoggedIn(),
				function(req, res) {
					models.Message
					.find({creator: req.user.id, mailbox: "drafts"})
					.select("date from_emails to_emails cc_emails bcc_emails subject html pop3_id")
					.limit(50)
					.sort('-date')
					.exec(function(err, drafts){
						if (err) return handleError(err);
						res.render('index', {
							user: req.user,
							messages: req.flash(),
							inbox: drafts,
							port: config.chat_port
						});
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
				if (typeof s == "undefined"){
					s = null;
				}else{
					s = s.toObject();
				}

				res.render('settings', {
					user: req.user,
					settings: s,
					messages: req.flash(),
					port: config.chat_port
				});
			});
		}
	);

	app.get('/about',
		function(req, res){
		port: config.chat_port
		res.render('about', {
			user: req.user,
			messages: req.flash(),
			port: config.chat_port
		});
	});

	app.post('/update_background',
		function(req, res){
			models.Settings.findOneAndUpdate({_id:req.user.settings}, {background_change:req.body.update_background}, {upsert:true}, function(err, doc){
			    if (err) return res.send(500, { error: err });
				//req.flash('info', 'Settings saved successfully');
			    res.status(200);
			    console.log("value: " + req.body.update_background);
			    console.log("update: " + doc.background_change);
		});
	});

	app.get('/get_background',
		function(req, res){
			models.Settings.findOne({_id:req.user.settings}, function(error, s) {
				if (error) {
					return handleError(error);
				}
				console.log("background: " + s.background_change);
				if(s.background_change){
					res.status(200);
					res.send("true");
				}else{
					res.status(200);
					res.send("false");
				}
		});
	});

};
