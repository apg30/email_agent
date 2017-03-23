// db.js
// ========

var mongoose = require('mongoose');

module.exports = {
	init : function(username, password, server, port){
		//Open database connection
		var s = "mongodb://" + 	username + ":" + password + "@" + server + ":" + port + "/" + username;
		console.log("Connecting to " + s);
		mongoose.connect(s);
		var conn = mongoose.connection;
		conn.on('error', console.error.bind(console, 'Connection error:'));
		return conn;
		}
};
