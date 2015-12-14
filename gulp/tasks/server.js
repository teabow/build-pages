var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy: false});
var argv = require('yargs').argv;
var sass = require('gulp-sass');
var sassSync = require('node-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var fs = require('fs-extra');
var util = require('./util');

var appDir = 'views/' + argv.view + '/';
var serveDir = '.tmp';
var commonDir = 'views/_common/';
var commonStyles = commonDir + 'styles/';
var conf = {};

gulp.task('load-conf', function () {
   conf = fs.readJSONFileSync(appDir + 'conf.json');
});

gulp.task('copyMock', function () {
    gulp.src(appDir + 'mock.js')
        .pipe(gulp.dest(appDir + serveDir));
});

gulp.task('copyImg', function () {
    gulp.src(appDir + 'img/*')
        .pipe(gulp.dest(appDir + serveDir + '/img'));
});

gulp.task('copyLib', function () {
    if (fs.existsSync(appDir + 'lib')) {
        fs.copySync(appDir + 'lib', appDir + serveDir + '/lib');
    }
});

gulp.task('css', function () {
    gulp.src(appDir + '**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(appDir + serveDir));
});

gulp.task('browserify', ['load-conf'], function () {
    return browserify({debug: false})
        .add('./' + appDir + 'main.js')
        .transform(require('partialify'))
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(appDir + serveDir));
});

gulp.task('compilePage', ['browserify', 'copyMock', 'css', 'copyImg', 'copyLib'], function () {

    var fs = require('fs-extra');
    var pageTemplate = fs.readFileSync(commonDir + 'page-template.html', {encoding: 'utf8'});
    var page = '';

    var cssResult = sassSync.renderSync({
        file: commonStyles + 'common.scss',
        outputStyle: 'compressed'
    });

    if (!fs.existsSync(appDir + serveDir)) {
        fs.mkdirSync(appDir + serveDir);
    }

    fs.copySync(commonDir + 'fonts', appDir + serveDir + '/fonts');
    fs.copySync(commonDir + 'img', appDir + serveDir + '/img');

    var staticsCss = util.buildStatics(conf.style.static, util.TYPE.STYLE);
    var staticsJs = util.buildStatics(conf.script.static, util.TYPE.SCRIPT);

    page = pageTemplate
        .replace('<!--include:title-->', conf.title)
        .replace('<!--include:description-->', conf.description)
        .replace('<!--include:static-css-->', staticsCss)
        .replace('<!--include:template-->', fs.readFileSync(appDir + 'main.html', {encoding: 'utf8'}))
        .replace('<!--include:main-css-->', conf.style.main.replace('.scss', '.css'))
        .replace('<!--include:static-js-->', staticsJs)
        .replace('<!--include:main-js-->', conf.script.main);

    fs.writeFileSync(appDir + serveDir + '/index.html', page, {encoding: 'utf8'});
});

gulp.task('watch', function () {
    gulp.watch([
        appDir + serveDir + '/**/*.html',
        appDir + serveDir + '/**/*.js',
        appDir + serveDir + '/**/*.css'
    ], function (event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });

    gulp.watch([
        //commonDir + 'lib/**/*.js',
        appDir + '*.js',
        appDir + 'main.html',
        appDir + '*.scss',
        commonStyles + 'common.scss'
    ], ['compilePage']);
});

gulp.task('connect', plugins.connect.server({
    root: [appDir + serveDir],
    port: 9000,
    livereload: true
}));

/**
 * Runs localhost server with non compiled files
 * @return {void}
 */
gulp.task('serve', ['compilePage'], function () {
    gulp.start('connect');
    gulp.start('watch');
});
