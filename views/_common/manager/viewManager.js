'use strict';

var $ = require('browserify-zepto');
var _template = require('lodash.template');
var utils = require('../utils/queryStringUtils');

/**
 * View manager used for all view interactions
 * @type {{render: Function, renderArray: Function, update: Function, addEvent: Function, get: Function, useJQuery: Function, params: {context: *, lang: *, env: *, _getParam: Function}}}
 */
var viewManager = {

    isReady: function (ready) {
        // To implement in each view
        ready && ready();
    },

    /**
     * Template the specified element with data
     * @param templateSelector the template selector
     * @param data the data to be templated
     * @returns {string} the templated string
     */
    template: function (templateSelector, data) {
        var template = _template($(templateSelector).html());
        return template(data);
    },

    /**
     * Renders a template given a selector and related data
     * @param containerSelector the container selector
     * @param templateFile the template file
     * @param data the data used to render template
     */
    render: function (containerSelector, templateFile, data) {
        var template = _template(templateFile);
        $(containerSelector).html(template(data));
    },

    /**
     * Render a template given a selector and related data array
     * @param containerSelector the container selector
     * @param templateSelector the template selector
     * @param dataArray the data array
     * @param iterator an iterator to update some data array value
     */
    renderArray: function (containerSelector, templateSelector, dataArray, iterator) {
        var tmp = '';
        for (var i = 0; i < dataArray.length; i++) {
            if (iterator) {
                iterator(dataArray[i]);
            }
            tmp += _template($(templateSelector).html())(dataArray[i]);
        }
        $(containerSelector).html(tmp);
    },

    /**
     * Update a value using a selector
     * @param selector the node selector
     * @param data the data to update
     */
    update: function (selector, data) {
        $(selector).html(data);
    },

    /**
     * Adds an event to the view
     * @param selector the node selector
     * @param event the event name
     * @param handler the handler function to implement
     */
    addEvent: function (selector, event, handler) {
        $(selector).off(event).on(event, handler);
    },

    /**
     * Adds a touch event to the view
     * @param selector the node selector
     * @param handler the handler function to implement
     */
    addTouchEvent: function (selector, handler) {
        var self = this;
        var time = 0;
        var _x1, _y1, _x2, _y2, touch;
        $(selector).off('touchstart').off('touchend');
        $(selector).on('touchstart', function (e) {
            time = new Date().getTime();
            touch = (e.changedTouches || e.originalEvent.changedTouches)[0];
            _x1 = touch.pageX;
            _y1 = touch.pageY;
        });
        $(selector).on('touchend', function (e) {
            touch = (e.changedTouches || e.originalEvent.changedTouches)[0];
            _x2 = touch.pageX;
            _y2 = touch.pageY;
            var diff = new Date().getTime() - time;
            var diffX = Math.abs(_x2 - _x1);
            var diffY = Math.abs(_y2 - _y1);

            self.pageX = _x2;
            self.pageY = _y2;

            if (isNaN(diffX) || isNaN(diffY)) {
                return false;
            }
            if (diff < 1000 && diffX < 8 && diffY < 8) {
                handler(e);
            }
            return false;
        });
    },

    /**
     * Retrieves last touches
     * @returns {{x: *, y: *}}
     */
    getLastTouches: function () {
        return {x: this.pageX, y: this.pageY};
    },

    /**
     * Gets a jquery element from the view
     * @param selector the node selector
     * @returns {*|jQuery|HTMLElement} a jquery object
     */
    get: function (selector) {
        return $(selector);
    },

    /**
     * View parameters
     */
    params: {
        lang: utils.getParam('lang'),
        env: utils.getParam('env'),
        extras: (utils.getParam('extras')) ? JSON.parse(decodeURI(utils.getParam('extras').replace(/%3A/gi, ':'))) : null
    }

};

$(document).ready(function () {
    viewManager.isReady();
});

module.exports = viewManager;
