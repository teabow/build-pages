'use strict';

window.cordova = {};
window.cordova.exec = function (successCB, errorCB, service, action, args) {
    if (service === 'Data' && action === 'get') {
        successCB('TEST');
    }
};

setTimeout(function () {
    var event = new Event('deviceready');
    document.dispatchEvent(event);
}, 500);
