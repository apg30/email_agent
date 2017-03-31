/* This is the main Node.js file, start using `node server.js`.
 * Authors: Cameron A. Craig, Stuart J. Thain, Aidan P. Gallagher, Lee A. Hamilton
 * Date: 25/02/2016
 */

// Import external libraries
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');

//Import user created libraries
var smtp = require('./lib/smtp');
var html = require('./lib/html');
var http2 = require('./lib/http');
var db = require('./lib/db');
var models = require('./lib/models');
var chat = require("./lib/chat.js");
var config = require("./config.js");
var path = require('path');

// datebase connection
var conn = db.init(config.mongodb_username,
    config.mongodb_password,
    config.mongodb_server,
    config.mongodb_port
);

var db = conn.db;
conn.once('open', function() {
    console.log('Connected to YouWatt MongoDB database')
});

// Configure local strategy for Passport authentication
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
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
// for parsing multipart/form-data
app.use(multer({
    dest: './uploads/'
}).array('multiInputFileName'));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//Allow flash messages
app.use(flash());

// Set the directory to look for CSS/JS etc.
app.use(express.static(__dirname + '/public_html'));

// Load routes from routes.js
require('./lib/routes')(app);

app.listen(config.port);

chat.start();
