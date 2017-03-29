var models = require('./models');
const simpleParser = require('mailparser').simpleParser;

var email_ids = [];
var email_id_idx = 0;

module.exports = function(pop3c) {
	return {
		retr: function(json_data){
			console.log("retr callback on " + json_data.id);
			simpleParser(json_data.content, function done(err, mail){
				//console.log(mail);

				var to_emails = [];
				if(typeof mail.to!= 'undefined'){
					for(var to_idx = 0; to_idx < mail.to.value.length; to_idx++){
						to_emails[to_idx] = mail.to.value[to_idx].address;
					}
				} else{
					var to_emails = [];
				}

				var cc_emails = [];
				if(typeof mail.cc!= 'undefined'){
					for(var cc_idx = 0; cc_idx < mail.cc.value.length; cc_idx++){
						cc_emails[cc_idx] = mail.cc.value[cc_idx].address;
					}
				} else{
					var cc_emails = [];
				}

				var bcc_emails = [];
				if(typeof mail.bcc!= 'undefined'){
					for(var bcc_idx = 0; bcc_idx < mail.bcc.value.length; bcc_idx++){
						bcc_emails[bcc_idx] = mail.bcc.value[bcc_idx].address;
					}
				} else{
					var bcc_emails = [];
				}

				var from_emails = [];
				if(typeof mail.from!= 'undefined'){
					for(var from_idx = 0; from_idx < mail.from.value.length; from_idx++){
						from_emails[from_idx] = mail.from.value[from_idx].address;
					}
				} else{
					var from_emails = [];
				}

				if(typeof mail.subject == 'undefined'){
					mail.subject = "No Subject";
				}

				//Form the message to be saved
				var message = new models.Message({
					to_emails: to_emails,
					cc_emails: cc_emails,
					bcc_emails: bcc_emails,
					from_emails: from_emails,
					subject: mail.subject,
					content: mail.text,
					creator: json_data.user_id,
					html: mail.html,
					raw_content: json_data.content, //raw data
					mailbox: 'inbox',
					date: mail.date,
					pop3_id: json_data.id
				});
				console.log(message);

				//Save the message to the database
				message.save(function (err, message) {
				  if (err) {
				    console.log(err);
				  } else {
						models.User.findByIdAndUpdate(
					    json_data.user_id,
					    { $push: {"inbox": message.id}
							},
					    {safe: true, upsert: true, new: true},
					    function(err, model) {
								if (err) console.log("ERROR: " + err);
								else {
									console.log("RETR SAVE SUCCESS!")
								}
					    }
						);
				  }
				});

				//Carry out the next retreival
				//Set state so another RETR can run
				pop3c.reset_state();

				if(email_id_idx <= 0){
					console.log("POP3 RETR DONE");
				} else {
					//TODO: Check if we already have the next email
					email_id_idx--;
					pop3c.retr(email_ids[email_id_idx].id);
				}
			});



		},
		login: function(json_data){
			console.log("login callback");
			pop3c.list();
		},
		list: function(json_data){
			email_ids = json_data;
			email_id_idx = email_ids.length - 1;
			pop3c.retr(json_data[email_id_idx].id);
		},
		stat: function(json_data){
			console.log("stat callback");
		}
	};
    };
