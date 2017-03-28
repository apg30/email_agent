var models = require('./models');

module.exports = function(pop3c) {
	return {
		retr: function(json_data){
			console.log("recv callback");
			var message = new models.Message({
				 background_change: false
			 });
			settings.save(function (err, s) {
			  if (err) {
				  return handleError(err);
			  }
			  // saved!
		  	});

		},
		login: function(json_data){
			console.log("login callback");
			pop3c.list();
		},
		list: function(json_data){
			console.log("list callback");
			for(var i = 0; i < json_data.length; i++){
				pop3c.retr(json_data[i].id);
			}
		},
		stat: function(json_data){
			console.log("stat callback");
		}
	};
    };
