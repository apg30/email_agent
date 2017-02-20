/* Takes in email JSON and returns HTML to display email in inbox */
function get_email_row_html(email) {
	var email_html = "";
	email_html += '<tr class="read_email">';
	email_html += '<td class = "read_email select"><div class="email-checkbox">';
	email_html += '<input type="checkbox" value="1" id="email-checkbox1" name="select" />';
	email_html += '</div></td>';
	email_html += '<td class="read_email from">';
	email_html += email.from;
	email_html += '</td>';
	email_html += '<td class="read_email subject">';
	email_html += email.subject;
	email_html += '</td>';
	email_html += '<td class="read_email date">';
	email_html += email.time;
	email_html += '</td>';
	email_html += '<td class="read_email actions">';
	email_html += "<button class = 'styled' onclick='display_message(" + JSON.stringify(email) + ");'>Read</button>";
	email_html += '</td>';
	email_html += "</tr>";
	return email_html;
}

/* Called when login button is pressed, before data is passed to server. */
function validate_login() {
	// Validate username
	var username = document.forms["login_form"]["username"].value;
	if(username == "") {
		message("error", "Username cannot be blank!");
		form.username.focus();
		return false;
    }
	var password = document.forms["login_form"]["password"].value;
	if (password == "") {
		message("error", "Password must be fiilled out!");
		return false;
	}
}
