var gulp = require("gulp");
var ejs = require("gulp-ejs");
var htmlv = require("gulp-html-validator");
var config = require("./config.js")

var parsed_folder = "parsed";
var validation_folder = "validation";

gulp.task('ejs_parse', function(){
  return gulp.src('views/*.ejs')
   .pipe(ejs({
	   user: {
		   username: "gulp_user"
	   },
	   settings: {
		   email_alias: "gulp_user",
	   }
   }, {ext:'.html'}))
   .pipe(gulp.dest(config.build_dest + parsed_folder))
});

gulp.task('validate', ['ejs_parse'], function () {
  gulp.src(config.build_dest + parsed_folder + '/*.ejs')
    .pipe(htmlv())
    .pipe(gulp.dest(config.build_dest + validation_folder));
});

gulp.task('test', ['ejs_parse', 'validate']);
