var models = require('./models');
const simpleParser = require('mailparser').simpleParser;

var email_ids = [];
var email_id_idx = 0;

module.exports = function(pop3c) {
	return {
		retr: function(json_data){
			console.log("retr callback");
			simpleParser(json_data.content, function done(err, mail){
				console.log(mail);

				var to_emails = [];
				if(typeof mail.to!= 'undefined'){
					for(var to_idx = 0; to_idx < mail.to.value.length; to_idx++){
						to_emails[to_idx] = mail.to.value[to_idx].address;
					}
				} else{
					var to_emails = ['undefined'];
				}

				/*models.User.findByIdAndUpdate(
			    json_data.user_id,
			    { $push: {"inbox": {
						pop3_id: json_data.id,
						raw_content: "raw_content", //json_data.content,
						subject: mail.subject,
						creator: json_data.user_id,
						html: "html", //mail.html,

						to_emails: to_emails,
						cc_emails: to_emails,
						bcc_emails: to_emails
					}}
					},
			    {safe: true, upsert: true, new: true},
			    function(err, model) {
						if (err) console.log("ERROR: " + err);
						else {
							console.log("RETR SAVE SUCCESS!")
						}
			    }
				);*/

				var message = new models.Message({
					to_emails: ['test@tets.com'],
					cc_emails: [],
					bcc_emails: [],
					subject: "Test Subject",
					content: "Test content",
					creator: json_data.user_id,
					html: "Test html",
					raw_content: "Raw content"
				});
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
			});





				/*models.User.findById(json_data.user_id, function(err, info) {
			    if (err) return res.send("message create error: " + err);




			    // add the message to the users inbox
			    models.User.update({_id: info._id}, {$push: {"inbox": {
						pop3_id: json_data.id,
						raw_content: "raw_content", //json_data.content,
						subject: mail.subject,
						creator: json_data.user_id,
						html: "html", //mail.html,

						to_emails: to_emails,
						cc_emails: to_emails,
						bcc_emails: to_emails
					}}}, function(err, numAffected, rawResponse) {
			      if (err) console.log("ERROR: " + err);
			      console.log('The number of updated documents was %d', numAffected);
			      console.log('The raw response from Mongo was ', rawResponse);

			    });
			  });
			});*/



			/*var message = new models.Message({
				 background_change: false
			 });
			message.save(function (err, s) {
			  if (err) {
				  return handleError(err);
			  }
			  // saved!
			});*/
				if(email_id_idx >= email_ids.length){
					console.log("POP3 RETR DONE");
				} else {
					email_id_idx++;
					pop3c.retr(email_ids[email_id_idx]);
				}

		},
		login: function(json_data){
			console.log("login callback");
			pop3c.list();
		},
		list: function(json_data){
			email_ids = json_data;
			pop3c.retr(json_data[email_id_idx].id);
		},
		stat: function(json_data){
			console.log("stat callback");
		}
	};
    };
