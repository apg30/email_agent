/*
	Displays a temporary message at the top of the window.
*/
function message(type, message) {
    var message_location;
    message_location = document.getElementById("message_location");
    var message_html;
    var message_type;
    var icon_type;

    if (type == "error") {
        message_type = "error_message";
        icon_type = "error_icon";
        text_type = "error_text";
    } else if (type == "info") {
        message_type = "info_message";
        icon_type = "info_icon";
        text_type = "info_text";
    } else if (type == "warning") {
        message_type = "warning_message";
        icon_type = "warning_icon";
        text_type = "warning_text";
    } else if (type == "success") {
        message_type = "success_message";
        icon_type = "success_icon";
        text_type = "success_text";
    }

    //Generate HTML for the notification message
    message_html = '<div class="message_box ' +
        message_type +
        '"><i class="' +
        icon_type +
        '"></i><span class = "' +
        text_type +
        '">' +
        message +
        '</span></div>';
    message_location.innerHTML += message_html;

    /* Remove the temporary messages from the DOM after they have faded out.
     This prevents the messages re-appearing if another message is triggered.
    */
    setTimeout(function() {
        message_location.innerHTML = "";
    }, 4100);

    return;
}

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
    email_html += "<button class ='styled read-mail-btn' onclick='display_message(" + JSON.stringify(email) + ");'>Read</button>";
    email_html += "<button id='" + email.message_id + "' class ='styled more-mail-btn'>More</button>";
    email_html += "<button class = 'delete_button' onclick='not_yet_implemented();'></button>";
    email_html += "<div id='more_dropdown" + email.message_id + "' class='dropdown-content more-dropdown-content'>" +
			            "<a id='more-reply-btn' onclick='more_reply_function(" + JSON.stringify(email) + ")'>Reply</a>" +
                  "<a id='more-replyall-btn' onclick='more_replyall_function(" + JSON.stringify(email) + ")'>Reply All</a>" +
			            "<a id='more-forward-btn' onclick='more_forward_function(" + JSON.stringify(email) + ")'>Forward</a>" +
			            "<a id='more-markasread-btn' onclick='not_yet_implemented()'>Mark As Read</a>" +
			            "<a id='more-moveto-btn' onclick='not_yet_implemented()'>Move To</a>" +
		              "</div>";
    email_html += '</td>';
    email_html += "</tr>";
    return email_html;
}



/***************Settings button****************************/
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
/********************************************/
