# Programmatic XHTML Validations in Python
# Martin Hepp and Alex Stolz
# mhepp@computer.org / alex.stolz@ebusiness-unibw.org

import urllib
import urllib2
import requests

URL = "http://validator.w3.org/nu/"
SITE_URL = "http://www.heppnetz.de"

r = requests.get(URL + "?doc=" + SITE_URL + "&out=json");

print r.status_code
print r.headers
print r.content
