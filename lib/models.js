// models.js
// ========

var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt-nodejs');

var user_schema = new mongoose.Schema({
	name: String,
	email: { type: String, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	password: { type: String},
	age: Number,
	created_at: Date,
	updated_at: Date,
	dob: Date,
	settings: { type: mongoose.Schema.Types.ObjectId, ref: "Settings", required: true },
	inbox: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	drafts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }]
});
user_schema.plugin(passportLocalMongoose);

var settings_schema = new mongoose.Schema({
	background_change: {type: Boolean, default: false},
	imap_server: {type: String, default: "imap.server.com"},
	email_alias: {type: String, default: "smithy@smiths.com"},

	//POP3 Settings
	pop3_host: {type: String, default: "outlook.office365.com"},
	pop3_port: {type: Number, default: 995},
	pop3_username: {type: String, default: "username@email.com"},
	pop3_password: {type: String, default: "password"}
});

var message_schema = new mongoose.Schema({
	pop3_id : {type: Number, required: false},
	mailbox: {type: String, required: true}, //inbox/sent etc
	to_emails : [{ type: String }],
	cc_emails: [{ type: String }],
	bcc_emails: [{ type: String }],
	from_emails: [{ type: String }],

	datetime: { type: Date, default: Date.now }, //retreival datetime
	date: {type: Date}, //time of sent/arrival

	subject : { type: String, required: true },
	raw_content : { type: String, required: true },
	html: { type: String, required: true }, //Displayed on web page?

	creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
				required: true
    }

});
message_schema.index(
   {
     subject: "text",
     to_emails: "text",
     from_emails: "text",
     cc_emails: "text",
     bcc_emails: "text",
     mailbox: "text",
     html: "text",
   }
 );

module.exports = {
	User : mongoose.model('User', user_schema),
	Settings : mongoose.model('Settings', settings_schema),
	Message : mongoose.model('Message', message_schema)
};
