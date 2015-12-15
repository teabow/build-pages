var gulp = require('gulp');
var notifier = require('node-notifier');
var sass = require('node-sass');
var browserify = require('browserify');
var path = require('path');
var uglifyJS = require("uglify-js");
var minifyHtml = require('html-minifier').minify;
var argv = require('yargs').argv;
var util = require('./util');

var commonDir = 'views/_common/';
var build = 'build/';

var OS = argv.os;
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
    var defaultConf = fs.readJSONFileSync('./views/default.conf.json');
    var pageTemplate = fs.readFileSync(commonDir + 'page-template.html', {encoding: 'utf8'});
    var page = '';

    PATH = (defaultConf && defaultConf.build && defaultConf.build.destination) || PATH;

    deleteFolderRecursive(PATH);
    fs.mkdirSync(PATH);
    fs.copySync(commonDir + 'fonts', PATH + '/fonts');
    fs.copySync(commonDir + 'img', PATH + '/img');

    var views = fs.readdirSync('views');

    var compilePage = function (i) {

        if (!views[i]) {
            notifier.notify({
                title: 'Build pages',
                message: 'Build pages complete',
                icon: path.join('./views/_common/img', 'ic_build.png'),
                sound: true
            });
            return;
        }

        if (/^[a-zA-Z].+[View$]/i.test(views[i]) && !/^_common/i.test(views[i]) && !/^build/i.test(views[i]) && !/^\./i.test(views[i])) {

            var page = '', jsContent= '', conf;

            console.log('building ' + views[i] + '...');

            buildFolder = 'views/' + views[i] + '/' + build;
            currentView = 'views/' + views[i];
            conf = fs.readJSONFileSync(currentView + '/' + 'conf.json');

            if (!fs.existsSync(buildFolder)) {
                fs.mkdirSync(buildFolder);
            }

            var cssResult = sass.renderSync({
                file: currentView + '/' + conf.style.main,
                outputStyle: 'compressed'
            });

            var staticsCss = util.buildStatics(conf.style.static, util.TYPE.STYLE);
            var staticsJs = util.buildStatics(conf.script.static, util.TYPE.SCRIPT);
            var platformIncludesCss = '', platformIncludesJs = '';
            if (OS && conf.platform) {
                for (var k = 0; k < conf.platform.length; k++) {
                    if (OS === conf.platform[k].os) {
                        var file, type;
                        for (var j = 0; j < conf.platform[k].files.length; j++) {
                            file = conf.platform[k].files[j];
                            if (file.indexOf('.css') > 0) {
                                platformIncludesCss += util.buildStatic(file, util.TYPE.STYLE);
                            } else if (file.indexOf('.js') > 0) {
                                platformIncludesJs += util.buildStatic(file, util.TYPE.SCRIPT);
                            }
                        }
                    }
                }
            }

            browserify({debug: false})
                .transform(require('partialify'))
                .add('./' + currentView + '/' + conf.script.main)
                .bundle(function (err, src) {
                    if (err) throw err;

                    page = pageTemplate
                        .replace('<!--include:title-->', conf.title)
                        .replace('<!--include:description-->', conf.description)
                        .replace('<!--include:static-css-->', staticsCss)
                        .replace('<link rel="stylesheet" href="<!--include:main-css-->">', '<style>'
                            + cssResult.css.toString()
                            + '</style>'
                            + platformIncludesCss)
                        .replace('<!--include:template-->', fs.readFileSync(currentView + '/main.html', {encoding: 'utf8'}))
                        .replace('<!--include:static-js-->', staticsJs + platformIncludesJs)
                        .replace('<script src="<!--include:main-js-->"></script>', '')
                        .replace('</body>', '')
                        .replace('</html>', '');

                    if (conf.build && conf.build.minifyJs) {
                        page += '<script>' + uglifyJS.minify(src.toString('utf8'), {fromString: true}).code + '</script>';
                    }
                    else {
                        page += '<script>' + src.toString('utf8') + '</script>';
                    }
                    page += '\n</body>\n</html>';

                    fs.writeFileSync(PATH + '/' + currentView.replace('views/', '') + '.html',
                        ((conf.build && conf.build.minifyHtml) ? minifyHtml(page, {
                            collapseWhitespace: true,
                            removeComments: true,
                            removeAttributeQuotes: true
                        }) : page),
                        {encoding: 'utf8'});
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
