// gulpfile.js
// ========

var gulp = require("gulp");
var ejs = require("gulp-ejs");
var htmlv = require("gulp-html-validator");
var Filehound = require("filehound");
var fs = require("fs");
var gulps = require("gulp-series");
var config = require("./config.js")

var parsed_folder = "parsed";
var validation_folder = "validation";

gulps.registerTasks({
		"ejs_parse" : (function(done) {
			return gulp.src('views/*.ejs')
		     .pipe(ejs({
		  	   user: {
		  		   username: "gulp_user"
		  	   },
		  	   settings: {
		  		   email_alias: "gulp_user",
		  	   }
		     }, {ext:'.html'}))
		     .pipe(gulp.dest(config.build_dest + parsed_folder));
			 done();
		}),
		"validate" : (function() {
			gulp.src(config.build_dest + parsed_folder + '/*.ejs')
		      .pipe(htmlv())
		      .pipe(gulp.dest(config.build_dest + validation_folder));
			  done();
		}),
		"check" : (function() {
			var files = Filehound.create()
				.ext('ejs')
				.paths(config.build_dest + validation_folder)
				.find();

			var success = true;
			files.then(function proc(files){
				for(var i = 0; i < files.length; i++){
					var file_success = true;
					console.log("Checking " + files[i]);
					var data = JSON.parse(fs.readFileSync(files[i]));
					for (var j = 0; j < data.messages.length; j++){
						if(typeof data.messages[j].type != 'undefined'){
							console.log(data.messages[j]);
							if(data.messages[j].type == "error"){
								console.log("\tError found");
								success = false;
								file_success = false;
							}
						}
					}
					if(file_success){
						console.log("\tOK");
					}
				}

				//Ensure the exit code reflects the success of the validation
				if(!success){
					process.exit(1);
				}
			});
		})
		done();
	});

	gulps.registerSeries("test", ["ejs_parse", "validate", "check"]);
