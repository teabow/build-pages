var gulp = require('gulp');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var appDir = 'views';

gulp.task('jsHint', function() {
    return gulp.src(appDir + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('test', ['jsHint'], function() {
    // Be sure to return the stream
    return gulp.src([
            'views/**/test.js'
        ])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});
