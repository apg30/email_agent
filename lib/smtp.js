// smpt.js
// ========

var net = require("net");
var html = require('./html');

module.exports = {
	send_email: function (request, response) {
		var page = "";
		var n = 0;
		var eol = "\r\n";
		var top = "From: \"" + request["from"] + "\" <" + request["fmail"] + ">" + eol +
			"To: \"" + request["to"] + "\" <" + request["tmail"] + ">" + eol +
			"Subject: " + request["subject"] + eol;
			
		var cmd = [ ["", "220"],
			["HELO hw.ac.uk", "250"],
			["MAIL FROM:<" + request["fmail"] + ">", "250"],
			["RCPT TO:<" + request["tmail"] + ">", "250"],
			["DATA", "354"],
			[top + eol + request["mail"] + eol + ".", "250"],
			["QUIT", "221"]
		];
		
		var client = net.connect(25, "mail-r.hw.ac.uk");

		client.on('data', function(data) {
			var msg = data.toString();
			var code = 0;
			if ( msg.length > 3 ){
				code = msg.substring(0, 3);
			}
			page += msg;
			if ( n < 6 && code == cmd[n][1] ) {
				n++;
				page += "<b>" + cmd[n][0].replace(/</g, "&lt;") + "</b>" + eol;
				client.write(cmd[n][0] + eol);
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

