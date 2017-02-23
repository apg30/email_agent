function setup_modal(modal, button, close) {
    if ((button == null) || (modal == null) || (close == null)) {
        return;
    }
    // When the user clicks the button, open the modal
    button.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    close.onclick = function() {
        modal.style.display = "none";
    }
}

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


/* Call this function when serverside functionality should follow,
   but is not yet supported.
*/
function not_yet_implemented() {
    message("error", "The feature you are requesting has not yet been implemented.");
    return false;
}

function display_message(email_message_json) {
    var modal = document.getElementById('read_email_modal');

    var close_button = document.getElementById('read_email_modal_close');

    // When the user clicks on <span> (x), close the modal
    close_button.onclick = function() {
        modal.style.display = "none";
    }

    var subject = document.getElementById('read_email_subject');
    subject.innerHTML = email_message_json.subject;

    var to = document.getElementById('read_email_to');
    to.innerHTML = email_message_json.to;

    var from = document.getElementById('read_email_from');
    from.innerHTML = email_message_json.from;

    var content = document.getElementById('read_email_content');
    content.innerHTML = email_message_json.content;

    // Display modal
    modal.style.display = "block";
    return true;
}

// Set up modals
var compose_modal = document.getElementById('compose_modal');
var compose_btn = document.getElementById("compose_button");
var compose_modal_close = document.getElementById("compose_modal_close");
setup_modal(compose_modal, compose_btn, compose_modal_close);

var chat_modal = document.getElementById('chat_modal');
var chat_btn = document.getElementById("chat_button");
var chat_modal_close = document.getElementById("chat_modal_close");
setup_modal(chat_modal, chat_btn, chat_modal_close);

var advanced_search_modal = document.getElementById('ad_search_modal');
var advanced_search_btn = document.getElementById("advanced_search_form");
var advanced_search_modal_close = document.getElementById("ad_search_modal_close");
setup_modal(advanced_search_modal, advanced_search_btn, advanced_search_modal_close);

var help_modal = document.getElementById('help_modal');
var help_modal_btn = document.getElementById("help_btn");
var help_modal_close = document.getElementById("help_modal_close");
setup_modal(help_modal, help_modal_btn, help_modal_close);

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == compose_modal) {
        compose_modal.style.display = "none";
    } else if (event.target == chat_modal) {
        chat_modal.style.display = "none";
    } else if (event.target == advanced_search_modal) {
        chat_modal.style.display = "none";
    }
}

//Test message box
var inbox_button = document.getElementById('inbox_button');
inbox_button.onclick = function() {
    message("error", "testing");
}

/* These are used by reply/reply ll/forward functions below */
function hide_read_email_buttons(){
	//Hide the buttons that are no longer relevant
	document.getElementById("delete_btn").style.display = "none";
	document.getElementById("reply_btn").style.display = "none";
	document.getElementById("reply_all_btn").style.display = "none";
	document.getElementById("forward_btn").style.display = "none";
}
function show_read_email_buttons(){
	//Hide the buttons that are no longer relevant
	document.getElementById("delete_btn").style.display = "inline";
	document.getElementById("reply_btn").style.display = "inline";
	document.getElementById("reply_all_btn").style.display = "inline";
	document.getElementById("forward_btn").style.display = "inline";
}

/* Reply stuff */
function show_reply_form(){
	hide_read_email_buttons();
	hide_forward_form();
	hide_reply_all_form();

	//Display the reply text area
	document.getElementById("reply_content").style.display = "inline";

	//Display the reply buttons
	document.getElementById("send_reply_btn").style.display = "inline";
	document.getElementById("cancel_reply_btn").style.display = "inline";
}

var reply_button = document.getElementById('reply_btn');
reply_button.onclick = function() {
	show_reply_form();
}

function hide_reply_form(){
	show_read_email_buttons();
	//Display the reply text area
	document.getElementById("reply_content").style.display = "none";
	//Hide all the stuff we shown for the reply option
	//Display the reply buttons
	document.getElementById("send_reply_btn").style.display = "none";
	document.getElementById("cancel_reply_btn").style.display = "none";
}

var cancel_reply_button = document.getElementById('cancel_reply_btn');
cancel_reply_button.onclick = function() {
	hide_reply_form();
}

/* Reply all stuff */
function show_reply_all_form(){
	hide_read_email_buttons();
	hide_forward_form();
	hide_reply_form();
	//Display the reply text area
	document.getElementById("reply_all_content").style.display = "inline";

	//Display the reply buttons
	document.getElementById("send_reply_all_btn").style.display = "inline";
	document.getElementById("cancel_reply_all_btn").style.display = "inline";
}

var reply_all_button = document.getElementById('reply_all_btn');
reply_all_button.onclick = function() {
	show_reply_all_form();
}

function hide_reply_all_form(){
	show_read_email_buttons();
	//Display the reply text area
	document.getElementById("reply_all_content").style.display = "none";
	//Hide all the stuff we shown for the reply option
	//Display the reply buttons
	document.getElementById("send_reply_all_btn").style.display = "none";
	document.getElementById("cancel_reply_all_btn").style.display = "none";
}

var cancel_reply_all_button = document.getElementById('cancel_reply_all_btn');
cancel_reply_all_button.onclick = function() {
	hide_reply_all_form();
}

function hide_reply_all_form(){
	show_read_email_buttons();
	hide_forward_form();
	hide_reply_form();
	//Display the reply text area
	document.getElementById("reply_all_content").style.display = "none";
	//Hide all the stuff we shown for the reply option
	//Display the reply buttons
	document.getElementById("send_reply_all_btn").style.display = "none";
	document.getElementById("cancel_reply_all_btn").style.display = "none";
}

/* Forward stuff */
function show_forward_form() {
	hide_read_email_buttons();

	//Display the reply text area
	document.getElementById("forward_content").style.display = "inline";

	//Display the reply buttons
	document.getElementById("send_forward_btn").style.display = "inline";
	document.getElementById("cancel_forward_btn").style.display = "inline";
}

var forward_button = document.getElementById('forward_btn');
forward_button.onclick = function() {
	show_forward_form();
}

function hide_forward_form() {
	show_read_email_buttons()

	//Display the reply text area
	document.getElementById("forward_content").style.display = "none";
	//Hide all the stuff we shown for the reply option
	//Display the reply buttons
	document.getElementById("send_forward_btn").style.display = "none";
	document.getElementById("cancel_forward_btn").style.display = "none";
}

var cancel_forward_button = document.getElementById('cancel_forward_btn');
cancel_forward_button.onclick = function() {
	hide_forward_form();
}



/********change backgrounds*******************/
var backgrounds = new Array(
    'url(img/backgrounds/01.jpg)', 'url(img/backgrounds/02.jpg)', 'url(img/backgrounds/03.jpg)', 'url(img/backgrounds/04.jpg)', 'url(img/backgrounds/05.jpg)', 'url(img/backgrounds/06.jpg)', 'url(img/backgrounds/08.jpg)', 'url(img/backgrounds/10.jpg)', 'url(img/backgrounds/11.jpg)', 'url(img/backgrounds/12.jpg)'
);
var current = 0;
var change = 1;

var background_change = document.getElementById('background_change_btn');
background_change.onclick = function() {
    if (change == 1) {
        change = 0;
        message("info", "The background will stop changing periodically.");
    } else {
        message("info", "The background will start changing periodially.");
        change = 1;
    }
}

function change_background() {
    if (change == 1) {
        current++;
        document.body.style.backgroundImage = backgrounds[current];
        if (current == backgrounds.length) {
            current = 0;
        }
    }
}
setInterval(change_background, 10000);
