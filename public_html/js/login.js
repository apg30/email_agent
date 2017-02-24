

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
        message("error", "Password must be fiilled out!");
        return false;
    }

}
