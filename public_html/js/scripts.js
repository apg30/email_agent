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

function show_reply_form(){
	//Hide the buttons that are no longer relevant
	document.getElementById("delete_btn").style.display = "none";
	document.getElementById("reply_btn").style.display = "none";
	document.getElementById("forward_btn").style.display = "none";

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
	//Hide the buttons that are no longer relevant
	document.getElementById("delete_btn").style.display = "inline";
	document.getElementById("reply_btn").style.display = "inline";
	document.getElementById("forward_btn").style.display = "inline";

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

function show_forward_form() {
	//Hide the buttons that are no longer relevant
	document.getElementById("delete_btn").style.display = "none";
	document.getElementById("reply_btn").style.display = "none";
	document.getElementById("forward_btn").style.display = "none";

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
	//Hide the buttons that are no longer relevant
	document.getElementById("delete_btn").style.display = "inline";
	document.getElementById("reply_btn").style.display = "inline";
	document.getElementById("forward_btn").style.display = "inline";

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

/* Mail more button functions*/

var btns = document.getElementsByClassName("more-mail-btn");
for (var i = 0; i < btns.length; i++){
  btns[i].onclick = function(e){
    console.log(e);
    var id = e.target.id;
    console.log(id);
    moreDropdown(id);
  }
}

//open the read modal and show the reply box
function more_reply_function(email){
  display_message(email);
  show_reply_form();
}

//open the read modal and show forward options
function more_forward_function(email){
  display_message(email);
  show_forward_form();
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
