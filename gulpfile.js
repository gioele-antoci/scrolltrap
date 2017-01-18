var gulp = require('gulp');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var rename = require('gulp-rename');

gulp.task('umd', function () {
	return gulp.src('src/scrolltrap.js')
	.pipe(umd({
		templateName: "amdNodeWeb",
		namespace: function (file) {
			return "scrolltrap";
		},
		exports: function (file) {
			return "scrolltrap";
		}
	})).pipe(gulp.dest('dist'));
});

gulp.task('uglify', function () {
	return gulp.src('dist/scrolltrap.js')
		.pipe(rename("scrolltrap.min.js"))
        .pipe(gulp.dest('dist/'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('cleanup', function () {
	return gulp.src(['src/*.js']).pipe(clean());
});

gulp.task('build', ['umd', 'uglify', 'cleanup']);
gulp.task('default', ['build']);
