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
				hide_all_email_forms();
				hide_all_send_modal_forms();
    }
}

var show=false;
function setup_chat(port, button) {

  var url = window.location.href.split(':');
  var chat_url = "http:" + url[1] + ":" + port;

    if ((button == null)) {
        console.log("button not defined");
        return;
    }
    // When the user clicks the button, open the modal
    button.onclick = function() {
        if(show==false){
          document.getElementById('chat_iframe').src = chat_url;
          show=true;
        }
        else{
          document.getElementById('chat_iframe').src = "";
          show=false;
        }
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
				hide_all_email_forms();
				hide_all_send_modal_forms();
    }

    var subject = document.getElementById('read_email_subject');
    subject.innerHTML = email_message_json.subject;

    var to = document.getElementById('read_email_to');
    to.innerHTML = email_message_json.to_emails;

		var cc = document.getElementById('read_email_cc');
    cc.innerHTML = email_message_json.cc_emails;

		var bcc = document.getElementById('read_email_bcc');
		bcc.innerHTML = email_message_json.bcc_emails;

    var from = document.getElementById('read_email_from');
    from.innerHTML = email_message_json.from_emails;

    var content = document.getElementById('read_email_content');
    content.innerHTML = email_message_json.html;

    // Display modal
    modal.style.display = "block";
    return true;
}

// Set up modals
var compose_modal = document.getElementById('compose_modal');
var compose_btn = document.getElementById("compose_button");
var compose_modal_close = document.getElementById("compose_modal_close");
setup_modal(compose_modal, compose_btn, compose_modal_close);


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
    var read_modal = document.getElementById('read_email_modal');
    var read_sent_modal = document.getElementById('read_sent_modal');
    var edit_draft_modal = document.getElementById('edit_draft_modal');
    if (event.target == compose_modal) {
        compose_modal.style.display = "none";
  //  } else if (event.target == chat_modal) {
  //      chat_modal.style.display = "none";
    } else if (event.target == advanced_search_modal) {
        advanced_search_modal.style.display = "none";
    } else if (event.target == help_modal) {
        help_modal.style.display = "none";
    } else if (event.target == read_modal) {
        read_modal.style.display = "none";
    } else if (event.target == read_sent_modal) {
        read_sent_modal.style.display = "none";
    } else if (event.target == edit_draft_modal) {
        edit_draft_modal.style.display = "none";
    }
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("myDropdown");
        for (var d = 0; d < dropdowns.length; d++) {
            var openDropdown = dropdowns[d];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

/* Email more button */
function moreDropdown(id) {
    document.getElementById("dropdown-" + id).classList.toggle("show");
}

/* Mail more button functions*/

var btns = document.getElementsByClassName("more-mail-btn");
for (var i = 0; i < btns.length; i++){
  btns[i].onclick = function(e){
    var id = e.target.id;
    moreDropdown(id);
  }
}

//open the read modal and show the reply box
function more_reply_function(email){
  display_message(email);
  show_reply_form();
}

function more_replyall_function(email){
  display_message(email);
  show_reply_all_form();
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
var toggle = getToggle();


var background_change = document.getElementById('background_change_btn');

function getToggle(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.responseText != "") {
			console.log(this.responseText);
			var cur = this.responseText;
			if(cur == "true"){
				toggle = true;
				return true;
			}
			else{
				toggle = false;
				return false;
			}
		}
	};
	xhttp.open("GET", "/get_background", true);
	xhttp.send();
	
}

background_change.onclick = function() {
	
    if (toggle) {
        toggle = false;
        message("info", "The background will stop changing periodically.");
    } else {
        message("info", "The background will start changing periodially.");
        toggle = true;
    }
    update_background(toggle);
}

function update_background(toggle) {
	var method = "post";
	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", "/update_background");
	
	var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", "update_background");
    hiddenField.setAttribute("value", toggle);
            
    form.appendChild(hiddenField);
            
    document.body.appendChild(form);
	form.submit();
}

function change_background() {
    if (toggle) {
        current++;
        document.body.style.backgroundImage = backgrounds[current];
        if (current == backgrounds.length) {
            current = 0;
        }
    }
}
setInterval(change_background, 10000);
