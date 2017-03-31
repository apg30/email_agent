function show_reply_form() {
    hide_read_email_buttons();
    hide_forward_forms();
    hide_reply_all_form();

    //Display the reply text area
    document.getElementById("reply_content").style.display = "inline";

    //Display the reply buttons
    document.getElementById("send_reply_btn").style.display = "inline";
    document.getElementById("cancel_reply_btn").style.display = "inline";
}

/* These are used by reply/reply all/forward functions below */
function hide_read_email_buttons() {
    //Hide the buttons that are no longer relevant
    document.getElementById("delete_btn").style.display = "none";
    document.getElementById("reply_btn").style.display = "none";
    document.getElementById("reply_all_btn").style.display = "none";
    document.getElementById("forward_btn").style.display = "none";
}

function show_read_email_buttons() {
    //Hide the buttons that are no longer relevant
    document.getElementById("delete_btn").style.display = "inline";
    document.getElementById("reply_btn").style.display = "inline";
    document.getElementById("reply_all_btn").style.display = "inline";
    document.getElementById("forward_btn").style.display = "inline";
}

function hide_reply_form() {
    show_read_email_buttons();
    //Display the reply text area
    document.getElementById("reply_content").style.display = "none";
    //Hide all the stuff we shown for the reply option
    //Display the reply buttons
    document.getElementById("send_reply_btn").style.display = "none";
    document.getElementById("cancel_reply_btn").style.display = "none";
}

function show_reply_all_form() {
    hide_read_email_buttons();
    hide_forward_forms();
    hide_reply_form();
    //Display the reply text area
    document.getElementById("reply_all_content").style.display = "inline";

    //Display the reply buttons
    document.getElementById("send_reply_all_btn").style.display = "inline";
    document.getElementById("cancel_reply_all_btn").style.display = "inline";
    return;
}

function hide_reply_all_form() {
    show_read_email_buttons();
    //Display the reply text area
    document.getElementById("reply_all_content").style.display = "none";
    //Hide all the stuff we shown for the reply option
    //Display the reply buttons
    document.getElementById("send_reply_all_btn").style.display = "none";
    document.getElementById("cancel_reply_all_btn").style.display = "none";
}

function hide_reply_all_form() {
    show_read_email_buttons();
    hide_forward_forms();
    hide_reply_form();
    //Display the reply text area
    document.getElementById("reply_all_content").style.display = "none";
    //Hide all the stuff we shown for the reply option
    //Display the reply buttons
    document.getElementById("send_reply_all_btn").style.display = "none";
    document.getElementById("cancel_reply_all_btn").style.display = "none";
}

function show_forward_form() {
    hide_read_email_buttons();
    hide_reply_form();
    hide_reply_all_form();

    //Display the reply text area
    document.getElementById("forward_content").style.display = "inline";

    //Display the reply buttons
    document.getElementById("send_forward_btn").style.display = "inline";
    document.getElementById("cancel_forward_btn").style.display = "inline";
}

function hide_forward_forms() {
    show_read_email_buttons();
    //Display the reply text area
    document.getElementById("forward_content").style.display = "none";
    //Hide all the stuff we shown for the reply option
    //Display the reply buttons
    document.getElementById("send_forward_btn").style.display = "none";
    document.getElementById("cancel_forward_btn").style.display = "none";
}

function hide_all_email_forms() {
    hide_reply_form();
    hide_forward_forms();
    hide_reply_all_form();
}

var divider = "\r\n=======================================================================\r\n";

function more_reply_info(email) {
    display_message(email);
    show_reply_form();
    //Set reply all to addresses to all from addresses + CC addresses
    var reply_to = document.getElementById("read_email_from").innerHTML.split(',');
    document.getElementById("reply_to_field").value = reply_to;
    var reply_subject = document.getElementById("read_email_subject").innerHTML;
    document.getElementById("reply_subject_field").value = "Re: " + reply_subject;
    var reply_content = document.getElementById("read_email_content").innerHTML;
    var reply_from = document.getElementById("read_email_from").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    var reply_bcc = document.getElementById("read_email_bcc").innerHTML;
    document.getElementById("original_content").value = divider +
        "FROM: " + reply_from + "\r\n" +
        "TO: " + reply_to + "\r\n" +
        "CC: " + reply_cc + "\r\n" +
        "Subject: " + reply_subject + "\r\n" +
        "\r\n" + reply_content;
}
/* Reply stuff */
var reply_button = document.getElementById('reply_btn');
reply_button.onclick = function reply_info() {
    show_reply_form();
    //Set reply all to addresses to all from addresses + CC addresses
    var reply_to = document.getElementById("read_email_from").innerHTML.split(',');
    document.getElementById("reply_to_field").value = reply_to;
    var reply_subject = document.getElementById("read_email_subject").innerHTML;
    document.getElementById("reply_subject_field").value = "Re: " + reply_subject;
    var reply_content = document.getElementById("read_email_content").innerHTML;
    var reply_from = document.getElementById("read_email_from").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    var reply_bcc = document.getElementById("read_email_bcc").innerHTML;
    document.getElementById("original_content").value = divider +
        "FROM: " + reply_from + "\r\n" +
        "TO: " + reply_to + "\r\n" +
        "CC: " + reply_cc + "\r\n" +
        "Subject: " + reply_subject + "\r\n" +
        "\r\n" + reply_content;
}

//var more_reply_button = document.getElementById('more_reply_btn');
//more_reply_button.onclick = reply_info();

var cancel_reply_button = document.getElementById('cancel_reply_btn');
cancel_reply_button.onclick = function() {
    hide_reply_form();
}

function more_reply_all_info(email) {
    display_message(email);
    show_reply_all_form();
    //Set reply all to addresses to all from addresses + CC addresses
    var reply_to = document.getElementById("read_email_from").innerHTML + "," + document.getElementById("read_email_to").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    document.getElementById("reply_all_to_field").value = reply_to;
    document.getElementById("reply_all_cc_field").value = reply_cc;
    var reply_subject = document.getElementById("read_email_subject").innerHTML;
    document.getElementById("reply_all_subject_field").value = "Re: " + reply_subject;
    var reply_content = document.getElementById("read_email_content").innerHTML;
    var reply_from = document.getElementById("read_email_from").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    var reply_bcc = document.getElementById("read_email_bcc").innerHTML;
    document.getElementById("original_all_content").value = divider +
        "FROM: " + reply_from + "\r\n" +
        "TO: " + reply_to + "\r\n" +
        "CC: " + reply_cc + "\r\n" +
        "Subject: " + reply_subject + "\r\n" +
        "\r\n" + reply_content;
}

/* Reply all stuff */
var reply_all_button = document.getElementById('reply_all_btn');
reply_all_button.onclick = function() {
    show_reply_all_form();
    //Set reply all to addresses to all from addresses + CC addresses
    var reply_to = document.getElementById("read_email_from").innerHTML + "," + document.getElementById("read_email_to").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    document.getElementById("reply_all_to_field").value = reply_to;
    document.getElementById("reply_all_cc_field").value = reply_cc;
    var reply_subject = document.getElementById("read_email_subject").innerHTML;
    document.getElementById("reply_all_subject_field").value = "Re: " + reply_subject;
    var reply_content = document.getElementById("read_email_content").innerHTML;
    var reply_from = document.getElementById("read_email_from").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    var reply_bcc = document.getElementById("read_email_bcc").innerHTML;
    document.getElementById("original_all_content").value = divider +
        "FROM: " + reply_from + "\r\n" +
        "TO: " + reply_to + "\r\n" +
        "CC: " + reply_cc + "\r\n" +
        "Subject: " + reply_subject + "\r\n" +
        "\r\n" + reply_content;
}

var cancel_reply_all_button = document.getElementById('cancel_reply_all_btn');
cancel_reply_all_button.onclick = function() {
    hide_reply_all_form();
}


/* Forward stuff */

function more_forward_info(email) {
    display_message(email);
    show_forward_form();
    var reply_to = document.getElementById("read_email_to").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    var reply_subject = document.getElementById("read_email_subject").innerHTML;
    document.getElementById("forward_subject_field").value = "Fw: " + reply_subject;
    var reply_content = document.getElementById("read_email_content").innerHTML;
    var reply_from = document.getElementById("read_email_from").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    var reply_bcc = document.getElementById("read_email_bcc").innerHTML;
    document.getElementById("original_forward_content").value = divider +
        "FROM: " + reply_from + "\r\n" +
        "TO: " + reply_to + "\r\n" +
        "CC: " + reply_cc + "\r\n" +
        "Subject: " + reply_subject + "\r\n" +
        "\r\n" + reply_content;
}

var forward_button = document.getElementById('forward_btn');
forward_button.onclick = function() {
    show_forward_form();
    var reply_to = document.getElementById("read_email_to").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    var reply_subject = document.getElementById("read_email_subject").innerHTML;
    document.getElementById("forward_subject_field").value = "Fw: " + reply_subject;
    var reply_content = document.getElementById("read_email_content").innerHTML;
    var reply_from = document.getElementById("read_email_from").innerHTML;
    var reply_cc = document.getElementById("read_email_cc").innerHTML;
    var reply_bcc = document.getElementById("read_email_bcc").innerHTML;
    document.getElementById("original_forward_content").value = divider +
        "FROM: " + reply_from + "\r\n" +
        "TO: " + reply_to + "\r\n" +
        "CC: " + reply_cc + "\r\n" +
        "Subject: " + reply_subject + "\r\n" +
        "\r\n" + reply_content;
}

var cancel_forward_button = document.getElementById('cancel_forward_btn');
cancel_forward_button.onclick = function() {
    hide_forward_forms();
}
