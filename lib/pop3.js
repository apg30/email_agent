// pop3.js
// ========

/* The following file simulates a connection to a mail server over 
 * 
 * */

var fs = require('fs');
var express = require('express');
var https = require('https');
var io = require("socket.io");
var tls = require("tls");
var config = require("../config.js");

/*function POP3Client(host, port, options) {
	if (options === undefined) options = {};
	var https_options = {};
	var url = "https://" + host + ":" + port;*/

var sock = tls.connect({
		host: config.pop3_host,
		port: config.pop3_port,
		//rejectUnauthorized: !self.data.ignoretlserrs
	}, function() {

		if (sock.authorized === false && self.data["ignoretlserrs"] === false) {
				self.emit("tls-error", socket.authorizationError);
				console.log("Error connecting to " + config.pop3_host + ":" + config.pop3_port);
		} else {
			console.log("Connected to " + config.pop3_host + ":" + config.pop3_port);
		}
	}
);
    
sock.on("data", onData);
sock.on("error", onError);
sock.on("end", onEnd);
sock.on("close", onClose);

var count = 0;
    
function onData(data) {
	if(data){
		data = data.toString("ascii");
		console.log("Received: " + data);
		var cmd = data.substr(0, 4).trim();
		console.log("cmd: "  + cmd);
		if(cmd == "+OK") {
			if(count == 0) {
				send("USER " + config.pop3_username + "\r\n");
				count++;
			} else if(count == 1) {
				console.log("PASS **********");
				send("PASS " + config.pop3_password + "\r\n");
				count++;
			} else if(count == 2) {
				console.log("LIST");
				send("LIST\r\n");
				count++;
				sock.end();
			}
		} else {
			console.log("Received unknown command: " + cmd);
		}
	} else {
		console.log("No data!");
	}
	
}
 function onError(data) {
	data = data.toString("ascii");
	console.log(data);
}
 function onEnd() {
	console.log("Session ended");
}
 function onClose(data) {
	data = data.toString("ascii");
	console.log(data);
}

function send(data){
	console.log("Sending: " + data);
	sock.write(data);
	console.log("Sent: " + data);
}


/*POP3Client.prototype.send = function(data) {
    this.socket.write(data);
}*/



