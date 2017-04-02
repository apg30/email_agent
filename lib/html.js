// html.js
// ========

var xmlserializer = require('xmlserializer');
const parse5 = require('parse5');

module.exports = {
    head: "<!DOCTYPE html>\n<html>\n<head>\n" +
        "<title>Post</title>\n</head>\n<body>\n<p>\n",

    tail: "</p>\n</body>\n</html>\n",
    html_xhtml: function(html_string) {
        dom = parse5.parse(html_string);
      return xmlserializer.serializeToString(dom);
    }
};
