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

// Get the modal
var compose_modal = document.getElementById('compose_modal');
var compose_btn = document.getElementById("compose_button");
var compose_modal_close = document.getElementById("compose_modal_close");
setup_modal(compose_modal, compose_btn, compose_modal_close);

var chat_modal = document.getElementById('chat_modal');
var chat_btn = document.getElementById("chat_button");
var chat_modal_close = document.getElementById("chat_modal_close");
setup_modal(chat_modal, chat_btn, chat_modal_close);

// When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == compose_modal) {
      compose_modal.style.display = "none";
    } else if(event.target == chat_modal){
    	chat_modal.style.display = "none"
    }
  }
