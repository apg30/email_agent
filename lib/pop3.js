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

var emails;
var email_ids = [];
var num_messages;
var num_bytes;
var msg_recv_idx = 0;
function onData(data) {
	if(data){
		data = data.toString("ascii");
		//console.log("Received: " + data);
		var cmd = data.substr(0, 4).trim();
		console.log("cmd: "  + cmd);
		if(cmd == "+OK") {
			//handle data
			if(count == 3){
				num_messages = data.split(" ")[1];
				num_bytes = data.split(" ")[2];
				console.log("num_messages: " + num_messages);
				console.log("num_bytes: " + num_bytes);
			} else if(count == 4){
				//Gets email ids and bytes from LIST command
				var msgs_ids = data.split("\r\n");
				for(var i = 0; i < msgs_ids.length - 1; i++){
					var msg = msgs_ids[i].split(" ");
					if(msg[0] != "+OK"){
						email_ids.push({id: msg[0], bytes: msg[1]});
					}
				}


				//console.log(email_ids);
			} else if (count > 4) {
				//Receive message data
				console.log("idx " + msg_recv_idx);
				console.log("Adding body to msg " + email_ids[msg_recv_idx].id)
				email_ids[msg_recv_idx++].body = data;
				console.log(data);
			}
			//Handle reply
			if(count == 0) {
				send("USER " + config.pop3_username + "\r\n");
				count++;
			} else if(count == 1) {
				console.log("PASS **********");
				send("PASS " + config.pop3_password + "\r\n");
				count++;
			} else if(count == 2) {
				console.log("STAT");
				send("STAT\r\n");
				count++;
			} else if(count == 3) {
				console.log("LIST");
				send("LIST\r\n");
				count++;
			} else {
				//Get each email body and adds to existing array
				//for(var j = 0; i < msgs_ids.length - 1; i++){
				//	var msg = email_ids[j];

				//}
				send("RETR " + email_ids[msg_recv_idx].id + "\r\n");
				count++;
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
	console.log("Closing session: " + data);
}

function send(data){
	console.log("Sending: " + data);
	sock.write(data);
	console.log("Sent: " + data);
}
//sock.end();

/*POP3Client.prototype.send = function(data) {
    this.socket.write(data);
}*/
