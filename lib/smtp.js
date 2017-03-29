// smpt.js
// ========

var net = require("net");
var html = require('./html');

module.exports = {
	send_email: function (request, response) {
		var page = "";
		var n = 0;
		var eol = "\r\n";
		var top = "From: \"" + request["compose_from"] + "\" <" + request["compose_from"] + ">" + eol +
			"To: \"" + request["compose_to"] + "\" <" + request["compose_to"] + ">" + eol +
			"Subject: " + request["compose_subject"] + eol;
		var cmd = [ ["", "220"],
			["HELO hw.ac.uk", "250"],
			["MAIL FROM:<" + request["compose_from"] + ">", "250"],
			["RCPT TO:<" + request["compose_to"] + ">", "250"],
			["DATA", "354"],
			[top + eol + request["compose_content"] + eol + ".", "250"],
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

