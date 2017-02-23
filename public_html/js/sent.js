/* Takes in email JSON and returns HTML to display email in inbox */
function get_sent_row_html(email) {
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
    email_html += "<button class ='styled read-mail-btn' onclick='display_message(" + JSON.stringify(email) + ");'>Read</button>";
    email_html += "<button class ='styled read-mail-btn' onclick='display_message(" + JSON.stringify(email) + ");'>Delete</button>";
    email_html += '</td>';
    email_html += "</tr>";
    return email_html;
}

function set_sent(emails){
	//Change from to to in table header
	var col2_text = document.getElementById("email_col_2").innerHTML = "To";
	//Clear existing table contents
	var table_body = document.getElementById("email_table_body");
	table_body.innerHTML = "";
	for (var i = 0; i < emails.length; i++) {
		var email = emails[i];
		var email_html = get_sent_row_html(email);
		table_body.innerHTML += email_html;
	}
}

document.getElementById("sent_button").onclick = function() {
	//emails is a global set in index.html
	console.log(emails);
	set_sent(emails);
}
