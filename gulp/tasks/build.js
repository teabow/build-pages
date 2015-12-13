var gulp = require('gulp');
var notifier = require('node-notifier');
var sass = require('node-sass');
var browserify = require('browserify');
var uglifyJS = require("uglify-js");
var argv = require('yargs').argv;
var commonDir = 'views/_common/';
var commonStyles = commonDir + 'styles/';
var build = 'build/';

var ENV = (argv.env) ? argv.env : 'dev';
var PATH = build;

var currentView = null;

var fs = require('fs-extra');
var deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

gulp.task('build', function () {

    var buildFolder = '';
    var pageTemplate = fs.readFileSync(commonDir + 'page-template.html', {encoding: 'utf8'});
    var page = '';

    deleteFolderRecursive(PATH);
    fs.mkdirSync(PATH);
    fs.copySync(commonDir + 'fonts', PATH + '/fonts');
    fs.copySync(commonDir + 'img', PATH + '/img');
    fs.mkdirSync(PATH + 'common');

    if (!fs.existsSync(build)) {
        fs.mkdirSync(build);
    }

    var views = fs.readdirSync('views');

    var compilePage = function (i) {

        if (!views[i]) {
            notifier.notify({
                title: 'Build pages',
                message: 'Build pages complete',
                //icon: path.join('./views/_common/img', 'ic_app.png'),
                sound: true
            });
            return;
        }

        if (/^[a-zA-Z].+[View$]/i.test(views[i]) && !/^_common/i.test(views[i]) && !/^build/i.test(views[i]) && !/^\./i.test(views[i])) {

            var page = '', conf;

            console.log('building ' + views[i] + '...');

            buildFolder = 'views/' + views[i] + '/' + build;
            currentView = 'views/' + views[i];
            conf = fs.readJSONFileSync(currentView + '/' + 'conf.json');

            if (!fs.existsSync(buildFolder)) {
                fs.mkdirSync(buildFolder);
            }

            var commonCssResult = sass.renderSync({
                file: commonStyles + 'common.scss',
                outputStyle: 'compressed'
            });

            var cssResult = sass.renderSync({
                file: currentView + '/' + conf.style.main,
                outputStyle: 'compressed'
            });

            browserify({debug: false})
                .transform(require('partialify'))
            .add('./' + currentView + '/' + conf.script.main)
            .bundle(function (err, src) {
                if (err) throw err;
                page = pageTemplate.replace('<!--include:title-->', conf.title);
                page = page.replace('<!--include:description-->', conf.description);
                page = page.replace('<!--include:css-->',
                    '<style>' + fs.readFileSync(commonStyles + 'normalize.min.css', {encoding: 'utf8'}) + '</style>' +
                    '<style>' + fs.readFileSync(commonStyles + 'simplegrid.css', {encoding: 'utf8'}) + '</style>' +
                    '<style>' + commonCssResult.css + '</style>');
                page = page.replace('<!--include:template-->', fs.readFileSync(currentView + '/main.html', {encoding: 'utf8'}));
                page = page.replace('<link rel="stylesheet" href="<!--include:main-css-->">', '<style>' + cssResult.css + '</style>');
                page = page.replace('<script src="<!--include:main-js-->"></script>', '');
                page = page.replace('</body>', '');
                page = page.replace('</html>', '');
                if (ENV === 'dev') {
                    page += '<script>' + src.toString('utf8') + '</script>';
                }
                else {
                    page += '<script>' + uglifyJS.minify(src.toString('utf8'), {fromString: true}).code + '</script>';
                }
                page += '</body></html>';
                fs.writeFileSync(PATH + currentView.replace('views/', '') + '.html', page, {encoding: 'utf8'});
                deleteFolderRecursive(buildFolder);
                compilePage(i+1);
            });

            if (fs.existsSync(currentView + '/img')) {
                fs.copySync(currentView + '/img', PATH + '/img');
            }
        }
        else {
            compilePage(i+1);
        }
    };

    if (views.length > 0) {
        compilePage(0);
    }

});
