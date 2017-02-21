#!/usr/bin/env python

import requests
import json
from optparse import OptionParser
# See https://github.com/validator/validator/wiki/Service-%C2%BB-Input-%C2%BB-POST-body

url = "http://validator.w3.org/nu/?out=json"

def validate(filename):
	filestring = open(filename, 'r').read()
	print filestring

	headers = {"content-type": "text/html; charset=utf-8"}
	r = requests.post(url, headers=headers, data=filestring)
	print r.text

#Handle command line options
parser = OptionParser()
parser.add_option("-i", "--input-file", dest="inputfile",
                  help="Input file.", metavar="FILE")

(options, args) = parser.parse_args()

print options

validate(options.inputfile)
