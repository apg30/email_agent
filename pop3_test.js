var pop3c = require("./lib/pop3.js");
var config = require("./config.js");

const simpleParser = require('mailparser').simpleParser;

console.log(pop3c);

function stat_recv(num_messages, num_bytes){
	console.log("STAT received (" + num_messages + ", " + num_bytes + ")");
	pop3c.list();
}

function login_recv(){
	console.log("LOGIN complete!");
	var stats = pop3c.stat();
}

function list_recv(json_data){
	console.log("LIST receieved!");
	pop3c.retr(json_data[0].id);
	//console.log(json_data);
}

function retr_recv(data){
	console.log("RETR receieved!");
	console.log(data);
	simpleParser(data, function done(err, mail){
		console.log(mail);
	});
	pop3c.close();
}


//Connects to the server and logs in the user
pop3c.connect(config.pop3_username,
	config.pop3_password,
	config.pop3_host,
	config.pop3_port
);

pop3c.login(config.pop3_username,
	config.pop3_password
);



pop3c.set_stat_callback(stat_recv);
pop3c.set_login_callback(login_recv);
pop3c.set_list_callback(list_recv);
pop3c.set_retr_callback(retr_recv);
