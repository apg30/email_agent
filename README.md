# `YouWatt` Email Client

[![Build Status](https://travis-ci.org/apg30/email_agent.svg?branch=stable)](https://travis-ci.org/apg30/email_agent)

# Introduction

An email client and instant messenger. User authentication via login page. Registration requires secret key.

# Technical

An HTML5/CSS3/Javascript frontent and Node.js backend.

A minimum number of third party libraries are used, we try not to use:

- Bootstrap
- jQuery
- Online HTML templates

The email client uses SMTP and POP3 to communicate with email servers.

The email client is supported in Chrome, Firefox and (hopeefully) IE (latest versions).

# Installation and Deployment

The `node` application can be started by running `node server.js` on the chosen server.

```
ssh <username>@<server>
...
cd ~/git/email_agent/
npm install
node server.js
```
## Configuration

Rename `default-config.js` to `config.js` and set appropriate credentials in the file.

# Features

## Email

- Read message in pop-up window by clicking on an email.
- Compose and send email within a pop-up window
- Delete messages.

The user agent should also

- interact with mailbox using either POP or IMAP
- interact with mail transport using SMTP
- add suitable headers to posted mail messages

Server programs must not use mail server APIs. They should drive SMTP, POP or IMAP interactions directly using application protocol directives.

## Instant Messaging

Allow instant messaging to user accounts also registered on YouWatt, instant messages can only be sent to users that are correspondents with each other.

# Development

The project could be divided into the following tasks

- initialisation & integration: eliciting user and mail service details, integrating parts
- composing & posting: composing and posting of mail messages
- handling mailbox: summarising contents of mailbox
- message retrieval & deletion: retrieval and deletion of e-mail messages

# Branch Structure

branch           | purpose
---------------- | -----------------------------------------------------------
`stable`         | Only stable code (it actually works).
`developer-name` | Non-stable 'sandbox' branch for developer.
`feature-name`   | Branch for the development of a feature before it's stable.

Merge developer branch into `stable` when the branch is ready for merging. Feature branches can also be used for more complex features. The criteria for being `stable` is:

- Valid HTML5
- Valid XHTML
- Valid CSS3
- No errors in browser console

# Folder Structure

```
.
├── config.js
├── lib
│   ├── db.js
│   ├── html.js
│   ├── http.js
│   ├── models.js
│   ├── pop3.js
│   ├── routes.js
│   └── smtp.js
├── LICENSE
├── node_modules
│   ├── bcrypt-nodejs
│   ├── body-parser
│   ├── connect-ensure-login
│   ├── cookie-parser
│   ├── ejs
│   ├── express
│   ├── express-session
│   ├── html-validator
│   ├── mongoose
│   ├── morgan
│   ├── multer
│   ├── passport
│   ├── passport-local
│   ├── passport-local-mongoose
│   └── socket.io
├── package.json
├── public_html
│   ├── cgi-bin
│   ├── css
│   ├── html
│   ├── img
│   └── js
├── README.md
├── server.js
├── uploads
└── views
    ├── about.ejs
    ├── index.ejs
    ├── login.ejs
    └── settings.ejs

```
