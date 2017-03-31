var fs = require('fs');
var express = require('express');
var https = require('https');
var io = require("socket.io");
var tls = require("tls");
var config = require("../config.js");

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
	LIST_WAITING:   {value: 8, name: "LIST_WAITING"}, //recved ok, waiting for rest
	RETR_SENT :			{value: 9, name: "RETR_SENT"},
	RETR_WAITING:   {value: 10, name: "RETR_WAITING"}, //recved ok, waiting for rest
	DELE_SENT :			{value: 11, name: "DELE_SENT"},
	QUIT_SENT :			{value: 12, name: "QUIT_SENT"}
};

var current_state = states.IDLE;

var callbacks = {

};

var shared_data = {
	stat: {num_messages: 0, num_bytes: 0},
	list: {body: "", array: []},
	retr: {body: "", id: 0},
	user_id: 0,
	dele: {id: 0, success: false}, //Whether the delete was successful or not.,
	user: {username: "", password: ""}
};

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
   sock.write(data);
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
			} else if (current_state == states.RETR_SENT) {
				console.log(data);
				current_state = states.RETR_WAITING;
			} else if (current_state == states.LIST_SENT) {
				var list_return = data.split("\r\n");
				var temp_data;
				for(var i = 0; i < list_return.length; i++){
					temp_data = list_return[i].split(" ");
					if(temp_data[0] != "+OK" && temp_data[0] != "" && temp_data[0] != "."){
						shared_data.list.array.push({id : parseInt(temp_data[0]), bytes: parseInt(temp_data[1])});
					}
				}

				if(data.substring(data.length - 3, data.length) == ".\r\n"){
					current_state = states.LOGGED_IN;
					callbacks.list(shared_data.list.array);

				}else {
					current_state = states.LIST_WAITING;
				}

			}else if (current_state == states.DELE_SENT) {
				shared_data.dele.success = true;
				console.log(data);
				current_state = states.LOGGED_IN;
				callbacks.dele(shared_data.dele.id);
			} else if(current_state == states.QUIT_SENT){
				current_state = states.IDLE;
				sock.end();
			}

		//Handle reply
		if(current_state == states.LOGGED_OUT) {
			send("USER " + shared_data.user.username + "\r\n");
			current_state = states.USERNAME_SENT;
		} else if(current_state == states.USERNAME_RECV) {
			send("PASS " + shared_data.user.password + "\r\n");
			current_state = states.PASSWORD_SENT;
		}

		} else {
			if (current_state == states.RETR_WAITING){
				shared_data.retr.body += data;
				if(data.substring(data.length - 3, data.length) == ".\r\n"){
					callbacks.retr({
						id: shared_data.retr.id,
						content: shared_data.retr.body,
						user_id: shared_data.user_id
					});
					current_state = states.LOGGED_IN;
				}
			} else if (current_state == states.LIST_WAITING){
				var list_return = data.split("\r\n");
				var temp_data;
				for(var i = 0; i < list_return.length; i++){
					temp_data = list_return[i].split(" ");
					if(temp_data[0] != "+OK" && temp_data[0] != "" && temp_data[0] != "."){
						shared_data.list.array.push({id : parseInt(temp_data[0]), bytes: parseInt(temp_data[1])});
					}
				}

				if(data.substring(data.length - 3, data.length) == ".\r\n"){
					current_state = states.LOGGED_IN;
					callbacks.list(shared_data.list.array);
				}
			} else if(current_state == states.DELE_SENT) {
				shared_data.dele.success = false;
				console.log(data);
				current_state = states.LOGGED_IN;
				callbacks.dele(shared_data.dele);
			}
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
   sock.write(data);
}

POP3Client.prototype.connect = function (host, port){
	console.log("Connecting to " + host + ":" + port);
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
}

POP3Client.prototype.set_stat_callback = function (callback){
	callbacks.stat = callback;
}
POP3Client.prototype.set_login_callback = function (callback){
	callbacks.login = callback;
}
POP3Client.prototype.set_list_callback = function (callback){
	callbacks.list = callback;
}
POP3Client.prototype.set_retr_callback = function (callback){
	callbacks.retr = callback;
}
POP3Client.prototype.set_dele_callback = function (callback){
	callbacks.dele = callback;
}

POP3Client.prototype.login = function (user, pass){
	shared_data.user.username = user;
	shared_data.user.password = pass;
	console.log("Logging in with " + user + " " + pass);
	//send("USER " + user + "\r\n");
}

POP3Client.prototype.set_user_id = function (id){
	shared_data.user_id = id;
}

POP3Client.prototype.stat = function() {
	if(current_state != states.LOGGED_IN){
		console.log("Cannot STAT, invalid state!");
		return;
	}

	send("STAT\r\n");
	current_state = states.STAT_SENT;
}

POP3Client.prototype.list = function() {
	if(current_state != states.LOGGED_IN){
		console.log("Cannot LIST, invalid state!");
		return;
	}

	send("LIST\r\n");
	current_state = states.LIST_SENT;
}

POP3Client.prototype.retr = function(id, number) {
	if(number) { //If the optional argument is not there, create a new variable with that name.
			shared_data.retr.number = number;
	} else{
		shared_data.retr.number = -1; //-1 indicates ALL
	}
	if(current_state != states.LOGGED_IN){
		console.log("Cannot RETR, invalid state! (" + current_state.name + ")");
		return;
	}
	shared_data.retr.id = id;
	shared_data.retr.body = "";
	send("RETR " +  id + "\r\n");
	current_state = states.RETR_SENT;
}

POP3Client.prototype.dele = function(id) {
	if(current_state != states.LOGGED_IN){
		console.log("Cannot DELE, invalid state! (" + current_state.name + ")");
		return;
	}
	shared_data.dele.id = id;
	shared_data.dele.success = false;
	send("DELE " +  id + "\r\n");
	current_state = states.DELE_SENT;
}


POP3Client.prototype.close = function(){
	send("QUIT\r\n");
	current_state = states.QUIT_SENT;
}

POP3Client.prototype.reset_state = function() {
	current_state = states.LOGGED_IN;
}

module.exports = new POP3Client();
/*
module.exports = function () {


	connect: connect,
	list : list,
	close : close

}
*/
