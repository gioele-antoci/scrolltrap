var gulp = require('gulp');
var umd = require('gulp-umd');
var uglify = require('gulp-uglify');
var del = require('del');

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
	}))
	.pipe(gulp.dest('src'));
});

gulp.task('uglify', function () {
    return gulp.src('src/scrolltrap.js')
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
});

gulp.task('cleanup', function () {
    return del(['src/*.js']);
});

gulp.task('default', ['umd', 'uglify', 'cleanup']);
