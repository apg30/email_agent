function setup_modal(modal, button, close) {
	if((button == null) || (modal == null) || (close == null)){
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
	} else if(type == "info") {
		message_type = "info_message";
		icon_type = "info_icon";
		text_type = "info_text";
	} else if(type == "warning") {
		message_type = "warning_message";
		icon_type = "warning_icon";
		text_type = "warning_text";
	} else if(type == "success") {
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

// When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == compose_modal) {
      compose_modal.style.display = "none";
    } else if(event.target == chat_modal){
    	chat_modal.style.display = "none"
    }
  }
