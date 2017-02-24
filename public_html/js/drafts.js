function edit_draft(email_message_json) {
    var modal = document.getElementById('edit_draft_modal');

    var close_button = document.getElementById('edit_draft_modal_close');

    // When the user clicks on <span> (x), close the modal
    close_button.onclick = function() {
        modal.style.display = "none";
				hide_all_email_forms();
    }

    var subject = document.getElementById('edit_draft_subject');
    subject.innerHTML = email_message_json.subject;

    var to = document.getElementById('edit_draft_to');
    to.innerHTML = email_message_json.to;

		var cc = document.getElementById('edit_draft_cc');
    cc.innerHTML = email_message_json.cc;

		var bcc = document.getElementById('edit_draft_bcc');
		bcc.innerHTML = email_message_json.bcc;

    var from = document.getElementById('edit_draft_from');
    from.innerHTML = email_message_json.from;

    var content = document.getElementById('edit_draft_content');
    content.innerHTML = email_message_json.content;

    // Display modal
    modal.style.display = "block";
    return true;
}

function delete_draft(email_message_json) {
	if(confirm("Are you sure you want to delete?")){
		//Ajax call to server to delete email
	}
  return true;
}

/* Takes in email JSON and returns HTML to display email in inbox */
function get_drafts_row_html(email) {
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
    email_html += "<button class ='styled read-mail-btn' onclick='edit_draft(" + JSON.stringify(email) + ");'>Edit</button>";
    email_html += "<button class ='delete_button read-mail-btn' onclick='delete_draft(" + JSON.stringify(email) + ");'></button>";
    email_html += '</td>';
    email_html += "</tr>";
    return email_html;
}

function set_drafts(emails){
	//Change from to to in table header
	var col2_text = document.getElementById("email_col_2").innerHTML = "From";
	//Clear existing table contents
	var table_body = document.getElementById("email_table_body");
	table_body.innerHTML = "";
	for (var i = 0; i < emails.length; i++) {
		var email = emails[i];
		var email_html = get_drafts_row_html(email);
		table_body.innerHTML += email_html;
	}
}

document.getElementById("drafts_button").onclick = function() {
	//emails is a global set in index.html
	set_drafts(emails);

}
