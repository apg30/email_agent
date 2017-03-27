var fs = require('fs');
var express = require('express');
var https = require('https');
var io = require("socket.io");
var tls = require("tls");
var config = require("../config.js");

var sock;
var count = 0;
var emails;
var email_ids = [];
var num_messages;
var num_bytes;
var msg_recv_idx = 0;

var POP3Client = function () {};

function on_error(data) {
   data = data.toString("ascii");
   console.log(data);
}
function on_end(data) {
   console.log("Session ended");
}


function on_close(data) {
   data = data.toString("ascii");
   console.log("Closing session: " + data);
}

function send(data){
   console.log("Sending: " + data);
   sock.write(data);
   console.log("Sent: " + data);
}

function on_data(data) {
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
			} /*else if (count > 4) {
				//Receive message data
				console.log("idx " + msg_recv_idx);
				console.log("Adding body to msg " + email_ids[msg_recv_idx].id)
				email_ids[msg_recv_idx++].body = data;
				console.log(data);
			}*/
			//Handle reply
			if(count == 0) {
				send("USER " + config.pop3_username + "\r\n");
				count++;
			} else if(count == 1) {
				send("PASS " + config.pop3_password + "\r\n");
				count++;
			} else if(count == 2) {
				send("STAT\r\n");
				count++;
			} else if(count == 3) {
				send("LIST\r\n");
				count++;
			} else if (count == 4) {
				//Get each email body and adds to existing array
				//for(var j = 0; i < msgs_ids.length - 1; i++){
				//	var msg = email_ids[j];

				//}
				//send("RETR " + email_ids[msg_recv_idx].id + "\r\n");
				send("RETR 2470\r\n");
				count++;
			}
		} else {
			if(data == ".\r\n"){
				//console.log("ENDENDNEDEN");
				console.log(email_ids[msg_recv_idx].body);
				msg_recv_idx++;
			}else {
				email_ids[msg_recv_idx].body += data;
			}

			//console.log("Received unknown command: " + cmd);
			//console.log("//////DATA//////");
			//console.log(data);
			//console.log("//////DATA//////");
		}
	} else {
		console.log("No data!");
	}

}

POP3Client.prototype.on_error = function(data) {
   data = data.toString("ascii");
   console.log(data);
}

POP3Client.prototype.on_error = function() {
   console.log("Session ended");
}

POP3Client.prototype.on_close = function(data) {
   data = data.toString("ascii");
   console.log("Closing session: " + data);
}

POP3Client.prototype.send = function(data){
   console.log("Sending: " + data);
   sock.write(data);
   console.log("Sent: " + data);
}

POP3Client.prototype.on_data = function (data) {
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
			} /*else if (count > 4) {
				//Receive message data
				console.log("idx " + msg_recv_idx);
				console.log("Adding body to msg " + email_ids[msg_recv_idx].id)
				email_ids[msg_recv_idx++].body = data;
				console.log(data);
			}*/
			//Handle reply
			if(count == 0) {
				send("USER " + config.pop3_username + "\r\n");
				count++;
			} else if(count == 1) {
				send("PASS " + config.pop3_password + "\r\n");
				count++;
			} else if(count == 2) {
				send("STAT\r\n");
				count++;
			} else if(count == 3) {
				send("LIST\r\n");
				count++;
			} else if (count == 4) {
				//Get each email body and adds to existing array
				//for(var j = 0; i < msgs_ids.length - 1; i++){
				//	var msg = email_ids[j];

				//}
				//send("RETR " + email_ids[msg_recv_idx].id + "\r\n");
				send("RETR 2470\r\n");
				count++;
			}
		} else {
			if(data == ".\r\n"){
				//console.log("ENDENDNEDEN");
				console.log(email_ids[msg_recv_idx].body);
				msg_recv_idx++;
			}else {
				email_ids[msg_recv_idx].body += data;
			}

			//console.log("Received unknown command: " + cmd);
			//console.log("//////DATA//////");
			//console.log(data);
			//console.log("//////DATA//////");
		}
	} else {
		console.log("No data!");
	}

}

POP3Client.prototype.connect = function (user, pass, host, port){
	sock = tls.connect({
			host: host,
			port: port,
			//rejectUnauthorized: !self.data.ignoretlserrs
		}, function() {

			if (sock.authorized === false && self.data["ignoretlserrs"] === false) {
					self.emit("tls-error", socket.authorizationError);
					console.log("Error connecting to " + host + ":" + port);
			} else {
				console.log("Connected to " + host + ":" + port);
			}
		}
	);
	sock.on("data", on_data);
	sock.on("error", on_error);
	sock.on("end", on_end);
	sock.on("close", on_close);

	sock.write("USER " + user + "\r\n");
	sock.write("PASS " + pass + "\r\n");
}

POP3Client.prototype.list = function() {
	sock.write("LIST\r\n");

}

POP3Client.prototype.close = function(){
	sock.end();
}

module.exports = new POP3Client();
/*
module.exports = function () {


	connect: connect,
	list : list,
	close : close

}
*/
