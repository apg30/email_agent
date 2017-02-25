// models.js
// ========

var mongoose = require('mongoose');

var user_schema = new mongoose.Schema({
	name: String,
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	age: Number,
	created_at: Date,
	updated_at: Date,
	dob: Date,
	settings: { type: mongoose.Schema.Types.ObjectId, ref: "Settings" },
	inbox: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	drafts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }]
});
	
var settings_schema = new mongoose.Schema({
	background_change: Boolean,
	imap_server: String,
	pop_server: String
});

var message_schema = new mongoose.Schema({
	to_emails : [{ type: String, required: true }],
	cc_emails: [{ type: String, required: true }],
	bcc_emails: [{ type: String, required: true }],
	
	datetime: { type: Date, required: true },
	
	subject : { type: String, required: true },
	content : { type: String, required: true },
	
});

module.exports = {
	user : mongoose.model('User', user_schema),
	settings : mongoose.model('Settings', settings_schema),
	message : mongoose.model('Message', message_schema)
};
