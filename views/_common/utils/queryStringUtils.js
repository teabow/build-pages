'use strict';

/**
 * Query string utils
 * @type {{getParam: Function}}
 */
var utils = {
    /**
     * Gets a param from url query string
     * @param key the param key
     * @returns {string} the param value
     */
    getParam: function (key) {
        var value = null;
        var indexOfTag = window.location.href.indexOf('?');
        if (indexOfTag > -1) {
            var queryString = window.location.href.substr(indexOfTag + 1);
            var indexOfKeyStart = queryString.indexOf(key + '=');
            if (indexOfKeyStart > -1) {
                var keyStart = queryString.substr(indexOfKeyStart + ((key + '=').length));
                var indexOfAnd = keyStart.indexOf('&');
                if (indexOfAnd > -1) {
                    value = keyStart.substr(0, indexOfAnd);
                }
                else {
                    value = keyStart;
                }
            }
        }
        return (value) ? value.trim() : value;
    }
};

module.exports = utils;