// smpt.js
// ========
 
var net = require("net");
var html = require('./html');

module.exports = {
	send_email: function (request, response) {
		var multiple = Array.from(request["compose_to"].split(", "));
		console.log(multiple);
		for(var i = 0; i < multiple.length; i++){
			var page = "";
			var n = 0;
			var eol = "\r\n";
			console.log("THIS IS THE LOG:" + multiple[i]);
			var top = "From: \"" + request["compose_from"] + "\" <" + request["compose_from"] + ">" + eol +
			"To: \"" + multiple[i] + "\" <" + multiple[i] + ">" + eol +
			"Subject: " + request["compose_subject"] + eol;
			
			var cmd = [ ["", "220"],
			["HELO hw.ac.uk", "250"],
			["MAIL FROM:<" + request["compose_from"] + ">", "250"],
			["RCPT TO:<" + multiple[i] + ">", "250"],
			["DATA", "354"],
			[top + eol + request["compose_content"] + eol + ".", "250"],
			["QUIT", "221"]
		];
			
		
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
			if ( n < 6 && code == cmd[n][1] ) {
				n++;
				page += "<b>" + cmd[n][0].replace(/</g, "&lt;") + "</b>" + eol;
				client.write(cmd[n][0] + eol, function(err){ client.end(); } );
				console.log("writing!!!!");
			} else {
				page = page.replace(/\r\n/g, "<br/>\r\n");
				try {
					console.log(page);
					response.sendStatus(200);
					} catch (exc) {}
			}
		});
		}
	}
};

