'use strict';

var fs = require('fs');

/**
 * Utils module
 */
module.exports = {

    TYPE: {
        SCRIPT: 'script',
        STYLE: 'style'
    },

    buildStatics: function (files, type) {
        var result = '';
        if (!files) return result;
        for (var i = 0; i < files.length; i++) {
            result += this._startTag(type)
                + fs.readFileSync(files[i], {encoding: 'utf8'})
                + this._endTag(type);
        }
        return result;
    },

    _startTag: function (type) {
        if (this._isScript(type)) {
            return '<script>';
        }
        return '<style>';
    },

    _endTag: function (type) {
        if (this._isScript(type)) {
            return '</script>';
        }
        return '</style>';
    },

    _isScript: function (type) {
        return type === this.TYPE.SCRIPT;
    }

};
