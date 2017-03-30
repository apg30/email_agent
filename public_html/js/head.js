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

/***************Settings button****************************/
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
/********************************************/
