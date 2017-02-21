import requests
import json
# See https://github.com/validator/validator/wiki/Service-%C2%BB-Input-%C2%BB-POST-body


url = "http://validator.w3.org/nu/?out=json"

def validate(filename):
	filestring = open(filename, 'r').read()

	# for line in filestring:
	# 	if line.contains()

	headers = {"content-type": "text/html; charset=utf-8"}
	r = requests.post(url, headers=headers, data=json.dumps(filestring))
	print r.text

files = [
	'public_html/index.shtml',
	'public_html/login.shtml',
]

for file in files:
	validate(file)
