var gulp = require('gulp');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

gulp.task('umd', function () {
    console.log("umd-ing");
    return gulp.src('scrolltrap.js')
	.pipe(umd({
	    templateName: "amdNodeWeb",
	    namespace: function (file) {
	        return "scrolltrap";
	    },
	    exports: function (file) {
	        return "scrolltrap";
	    }
	})).pipe(gulp.dest('src'));
});

gulp.task('uglify', function () {
    return gulp.src('src/scrolltrap.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
});

gulp.task('cleanup', function () {
    return gulp.src(['src/*.js']).pipe(clean());
});

gulp.task('build', ['cleanup', 'umd', 'uglify']);
gulp.task('default', ['build']);
