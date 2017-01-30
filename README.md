#Email and instant messaging application

The web front end will be realised in the XHTML syntax of HTML 5 with a CSS 3 stylesheet

The middle tier will run under a public web server using a *suitable web programming technology*

The backend will either be an existing application service like an IRC, mail, Twitter or XMPP instant messenger service, or be a custom service built to support the application.


The Mail User Agent should work with local SMTP servers and with either POP or IMAP servers and let users read their mail and post mail messages.

The user agent should run within a web browser and let users

browse subject and other details of messages in mail box
* read selected mail messages
* compose and post mail messages
* delete selected mail messages

The user agent should also
* interact with mailbox using either POP or IMAP
* interact with mail transport using SMTP
* add suitable headers to posted mail messages

Server programs must not use mail server APIs. They should drive SMTP, POP or IMAP interactions directly using application protocol directives.

The project could be divided into the following tasks

* initialisation & integration	eliciting user and mail service details, integrating parts
* composing & posting	composing and posting of mail messages
* handling mailbox	summarising contents of mailbox
* message retrieval & deletion	retrieval and deletion of e-mail messages
