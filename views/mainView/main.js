'use strict';

/** import libraries **/
var view = require('../_common/manager/viewManager');

var containerContent = 'main .mainContent';
var contentTemplate = require('./templates/main.content.html');

view.isReady = function () {
    view.render(containerContent, contentTemplate, {title: 'MainView is ready'});
};

/**
 * Error handler
 * @param e
 */
var onError = function (e) {
    console.log('Error', e);
};
