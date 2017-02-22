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
    if (username == "") {
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

/***************Settings button****************************/
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var d = 0; d < dropdowns.length; d++) {
            var openDropdown = dropdowns[d];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
/********************************************/

/* Detect whether drag and drop is supported by the browser */
var advanced_upload_supported = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();
