// smpt.js
// ========
 
var net = require("net");
var html = require('./html');

Array.prototype.extend = function (other_array) {
    /* you should include a test to check whether other_array really is an array */
    other_array.forEach(function(v) {this.push(v)}, this);    
}

module.exports = {
	send_email: function (request, response) {
			var page = "";
			var n = 0;
			var eol = "\r\n";
			var name = request["name"];
			var to_list = request[name + "_to"].split(",");
			var to_add = [];
			var cc_list = request[name + "_cc"].split(",");
			var cc_add = [];
			var bcc_list = request[name + "_bcc"].split(",");
			console.log("bcc: " + bcc_list + " length: " + bcc_list.length);
			var bcc_add = [];
			
			var top = "From: \"" + request[name + "_from"] + "\" <" + request[name + "_from"] + ">" + eol +
			"To: \"" + request[name + "_to"] + "\" <" + request[name + "_to"] + ">" + eol +
			"CC: \"" + request[name + "_cc"] + "\" <" + request[name + "_cc"] + ">" + eol +
			"Subject: " + request[name + "_subject"] + eol;
			
			var cmd_start = [ ["", "220"],
			["HELO hw.ac.uk", "250"],
			["MAIL FROM:<" + request[name + "_from"] + ">", "250"]
			];
			
			if(to_list.length > 0 && to_list[0] != ""){
				for(i = 0; i < to_list.length; i++){
					to_add.push(["RCPT TO:<" + to_list[i] + ">", "250"]);
				}
				cmd_start.extend(to_add);
			}
			if(cc_list.length > 0 && cc_list[0] != ""){
				for(i = 0; i < cc_list.length; i++){
					cc_add.push(["RCPT TO:<" + cc_list[i] + ">", "250"]);
				}
				cmd_start.extend(cc_add);
			}
			if(bcc_list.length > 0 && bcc_list[0] != ""){
				for(i = 0; i < bcc_list.length; i++){
					bcc_add.push(["RCPT TO:<" + bcc_list[i] + ">", "250"]);
				}
				cmd_start.extend(bcc_add);
			}
			var content = request[name + "_content"]
			
			if(name == "compose"){
				cmd_end = [["DATA", "354"],
				[top + eol + content[0] + eol + ".", "250"],
				["QUIT", "221"]
				];
			}else{
				cmd_end = [["DATA", "354"],
				[top + eol + content[0] + eol + content[1] + eol + ".", "250"],
				["QUIT", "221"]
			];
			}
			
			cmd_start.extend(cmd_end);
			
		
		var client = net.connect(25, "mail-r.hw.ac.uk");
		console.log("client connected");
		client.on('data', function(data) {
			var msg = data.toString();
			var code = 0;
			if ( msg.length > 3 ){
				code = msg.substring(0, 3);
			}
			page += msg;
			console.log("code: " +code);
			if ( n < cmd_start.length-2 && code == cmd_start[n][1] ) {
				n++;
				page += "<b>" + cmd_start[n][0].replace(/</g, "&lt;") + "</b>" + eol;
				client.write(cmd_start[n][0] + eol);
			} else {
				page = page.replace(/\r\n/g, "<br/>\r\n");
				try {
					console.log(page);
					response.sendStatus(200);
					} catch (exc) {}
				client.end();
			}
		});
	}
};


