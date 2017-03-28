module.exports = function(pop3c) {
	return {
		retr: function(json_data){
			console.log("recv callback");
		},
		login: function(json_data){
			console.log("login callback");
			pop3c.list();
		},
		list: function(json_data){
			console.log("list callback");
		},
		stat: function(json_data){
			console.log("stat callback");
		}
	};
    };
