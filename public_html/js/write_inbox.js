for (var i = 0; i < emails.length; i++) {
	var email = emails[i];
	var email_html = get_email_row_html(email);
	document.write(email_html);
}
