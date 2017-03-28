

/* Called when login button is pressed, before data is passed to server. */
function validate_login() {
    // Validate username
    var username = document.forms["login_form"]["username"].value;
    if (username == "") {
        message("error", "Username cannot be blank!");
        return false;
    }
    var password = document.forms["login_form"]["password"].value;
    if (password == "") {
        message("error", "Password must be filled out!");
        return false;
    }
}
/* Called when login button is pressed, before data is passed to server. */
function validate_register() {
  var password = document.forms["register_form"]["password"].value;
  var confirm_password = document.forms["register_form"]["confirm_password"].value;
  console.log("validate reg");
  if (password != confirm_password){
    message("error", "Passwords must match");
    return false;
  }
}
