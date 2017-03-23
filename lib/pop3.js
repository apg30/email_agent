// pop3.js
// ========

var fs = require('fs');
var express = require('express');
var https = require('https');
var io = require("socket.io");
var tls = require("tls");

/*function POP3Client(host, port, options) {
	if (options === undefined) options = {};
	var https_options = {};
	var url = "https://" + host + ":" + port;*/

var host = "outlook.office365.com";
var port = 995;	
var sock = tls.connect({
		host: host,
		port: port
		//rejectUnauthorized: !self.data.ignoretlserrs
	}, function() {

		if (sock.authorized === false && 
			self.data["ignoretlserrs"] === false)
				self.emit("tls-error", socket.authorizationError);
	}
);
    
sock.on("data", onData);
sock.on("error", onError);
sock.on("end", onEnd);
sock.on("close", onClose);




var count = 0;
    
function onData(data){
	if(data){
		data = data.toString("ascii");
		console.log("Received: " + data);
		var cmd = data.substr(0, 4).trim();
		console.log("cmd: "  + cmd);
		if(cmd == "+OK") {
			if(count == 0) {
				send("USER cac30@hw.ac.uk");
				count++;
			} else if(count == 1) {
				console.log("PASS **********");
				sock.write("PASS Tppiwarez24");
				count++;
			} else if(count == 2) {
				console.log("STAT");
				sock.write("STAT");
				count++;
				sock.end();
			}
		}
	} else {
		console.log("No data!");
	}
	
}
 function onError(data){
	data = data.toString("ascii");
	console.log(data);
}
 function onEnd(){
	console.log("Session ended");
}
 function onClose(data){
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



