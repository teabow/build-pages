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
            result += this.buildStatic(files[i], type);
        }
        return result;
    },

    buildStatic: function (file, type) {
        return this._startTag(type)
            + fs.readFileSync(file, {encoding: 'utf8'})
            + this._endTag(type);
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
