// gulpfile.js
// ========

var gulp = require("gulp");
var ejs = require("gulp-ejs");
var w3cjs = require("gulp-w3cjs");
var through2 = require('through2');
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
		}),
		"validate" : (function() {
			gulp.src(config.build_dest + parsed_folder + "/*.ejs")
	        .pipe(w3cjs())
	        .pipe(through2.obj(function(file, enc, cb){
	            cb(null, file);
	            if (!file.w3cjs.success){
	                throw new Error('HTML validation error(s) found');
	            }
	        }));
		})
	});

	gulps.registerSeries("test", ["ejs_parse", "validate"]);
