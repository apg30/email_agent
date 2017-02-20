function setup_modal(modal, button, close) {
  // When the user clicks the button, open the modal
  button.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  close.onclick = function() {
    modal.style.display = "none";
  }
}

function message(type, message) {
	if (type == "error") {
		var message_box = document.getElementsByClassName("error_message")[0];
		var message_text = document.getElementsByClassName("error_text")[0];
		message_text.innerHTML = message;
		message_box.style.display = "inline";
		message_box.className += " notification";
		//message_box.style.display = "none";
	}
	return;
}

/* Call this function when serverside functionality should follow,
   but is not yet supported.
*/
function not_yet_implemented() {
	message("error", "The feature you are requesting has not yet been implemented.");
	//alert("not yet implemented");
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
	//var email_message = JSON.parse(email_message_json);
	/*
		'subject', 'to', 'from', 'content',
	*/

	// Display modal
	modal.style.display = "block";
	return true;
}

/* Called when login button is pressed, before data is passed to server. */
function validate_login() {
	// Validate username
	var username = document.forms["login_form"]["username"].value;
	if(username == "") {
      alert("Error: Username cannot be blank!");
      form.username.focus();
      return false;
    }
	if (x == "") {
			alert("Name must be filled out");
			return false;
	}
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

// When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == compose_modal) {
      compose_modal.style.display = "none";
    } else if(event.target == chat_modal){
    	chat_modal.style.display = "none"
    }
  }

//Test message box
var inbox_button = document.getElementById('inbox_button');
inbox_button.onclick = function() {
	message("error", "testing");
}

/********change backgrounds*******************/
var backgrounds = new Array(
    'url(../img/backgrounds/01.jpg)'
  , 'url(../img/backgrounds/02.jpg)'
  , 'url(../img/backgrounds/03.jpg)'
  , 'url(../img/backgrounds/04.jpg)'
  , 'url(../img/backgrounds/05.jpg)'
  , 'url(../img/backgrounds/06.jpg)'
  , 'url(../img/backgrounds/08.jpg)'
  , 'url(../img/backgrounds/10.jpg)'
  , 'url(../img/backgrounds/11.jpg)'
  , 'url(../img/backgrounds/12.jpg)'
);
var current = 0;
function change_background() {
  current++;
  document.body.style.backgroundImage = backgrounds[current];
  if (current == backgrounds.length)
  {
    current =0;
  }
}
setInterval(change_background, 10000);
