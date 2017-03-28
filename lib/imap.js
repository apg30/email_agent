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

/* We keep track of the state of the connection in order to channel data to
 * the correct callback functions. */
var states = {
	IDLE :					{value: 0, name: "IDLE"},
	LOGGED_OUT :		{value: 1, name: "LOGGED_OUT"},
	USERNAME_SENT :	{value: 2, name: "USERNAME_SENT"},
	USERNAME_RECV : {value: 3, name: "USERNAME_RECV"},
	PASSWORD_SENT :	{value: 4, name: "PASSWORD_SENT"},
	LOGGED_IN :			{value: 5, name: "LOGGED_IN"}, //return-to state (logged in , no pending data)

	STAT_SENT :			{value: 6, name: "STAT_SENT"},
	LIST_SENT :			{value: 7, name: "LIST_SENT"},
	RETR_SENT :			{value: 8, name: "RETR_SENT"},
	RETR_WAITING:   {value: 9, name: "RETR_WAITING"}, //recved ok, waiting for rest
};

var current_state = states.IDLE;

var callbacks = {

};

var shared_data = {
	stat: {num_messages: 0, num_bytes: 0},
	list: [],
	retr: {body: "", id: 0},
};

var IMAPClient = function () {};

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
   sock.write(data, function data(data){
		 //console.log("hello world");
	 });
   console.log("Sent: " + data);
}

function on_data(data) {
	if(data){
		data = data.toString("ascii");
		//console.log("Received: " + data);
		var cmd = data.substr(0, 4).trim();
		if(cmd == "+OK") {
			console.log("cmd: "  + cmd);

			//Transition to correct state on data
			if(current_state == states.IDLE){
				current_state = states.LOGGED_OUT;
			} else if(current_state == states.LOGGED_OUT){
				current_state = states.USERNAME_SENT;
			} else if (current_state == states.USERNAME_SENT){
				current_state = states.USERNAME_RECV;
			} else if (current_state == states.PASSWORD_SENT){
				current_state = states.LOGGED_IN;
				callbacks.login();
			} else if(current_state == states.STAT_SENT){
				current_state = states.LOGGED_IN;
				shared_data.stat.num_messages = parseInt(data.split(" ")[1]);
				shared_data.stat.num_bytes = parseInt(data.split(" ")[2]);
				callbacks.stat(shared_data.stat.num_messages, shared_data.stat.num_bytes);
			} else if (current_state == states.LIST_SENT) {
				var list_return = data.split("\r\n");
				var temp_data;
				for(var i = 0; i < list_return.length; i++){
					temp_data = list_return[i].split(" ");
					if(temp_data[0] != "+OK" && temp_data[0] != ""){
						shared_data.list.push({id : temp_data[0], bytes: temp_data[1]});
					}
				}
				current_state = states.LOGGED_IN;
				callbacks.list(shared_data.list);
			} else if (current_state == states.RETR_SENT) {
				console.log(data);
				current_state = states.RETR_WAITING;
			}

			//Handle reply
			if(current_state == states.LOGGED_OUT) {
				send("USER " + config.pop3_username + "\r\n");
				current_state = states.USERNAME_SENT;
			} else if(current_state == states.USERNAME_RECV) {
				send("PASS " + config.pop3_password + "\r\n");
				current_state = states.PASSWORD_SENT;
			}

		} else {
			if (current_state == states.RETR_WAITING){
				shared_data.retr.body += data;
				if(data.substring(data.length - 3, data.length) == ".\r\n"){
					callbacks.retr(shared_data.retr.body);
					current_state = states.LOGGED_IN;
				}
			}
		}
	} else {
		console.log("No data!");
	}

}

IMAPClient.prototype.on_error = function(data) {
   data = data.toString("ascii");
   console.log(data);
}

IMAPClient.prototype.on_error = function() {
   console.log("Session ended");
}

IMAPClient.prototype.on_close = function(data) {
   data = data.toString("ascii");
   console.log("Closing session: " + data);
}

IMAPClient.prototype.send = function(data){
   console.log("Sending: " + data);
   sock.write(data);
   console.log("Sent: " + data);
}

IMAPClient.prototype.connect = function (user, pass, host, port){
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

	//sock.write("USER " + user + "\r\n");
	//sock.write("PASS " + pass + "\r\n");
}

IMAPClient.prototype.set_stat_callback = function (callback){
	callbacks.stat = callback;
}
IMAPClient.prototype.set_login_callback = function (callback){
	callbacks.login = callback;
}
IMAPClient.prototype.set_list_callback = function (callback){
	callbacks.list = callback;
}
IMAPClient.prototype.set_retr_callback = function (callback){
	callbacks.retr = callback;
}

IMAPClient.prototype.login = function (user, pass){
	sock.write("USER " + user + "\r\n", function data(data){
		console.log("username sent?");
		console.log(data);
	});
}

IMAPClient.prototype.stat = function() {
	if(current_state != states.LOGGED_IN){
		console.log("Cannot STAT, invalid state!");
		return;
	}

	send("STAT\r\n");
	current_state = states.STAT_SENT;


}

IMAPClient.prototype.list = function() {
	if(current_state != states.LOGGED_IN){
		console.log("Cannot LIST, invalid state!");
		return;
	}

	send("LIST\r\n");
	current_state = states.LIST_SENT;
}

IMAPClient.prototype.retr = function(id) {
	if(current_state != states.LOGGED_IN){
		console.log("Cannot RETR, invalid state!");
		return;
	}

	send("RETR " +  id + "\r\n");
	current_state = states.RETR_SENT;
}


IMAPClient.prototype.close = function(){
	sock.end();
}

module.exports = new IMAPClient();
/*
module.exports = function () {


	connect: connect,
	list : list,
	close : close

}
*/
