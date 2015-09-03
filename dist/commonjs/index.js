'use strict';

exports.__esModule = true;
exports.configure = configure;

var _configure = require('./configure');

function configure(aurelia, configCallback) {
    var instance = aurelia.container.get(_configure.Configure);

    if (configCallback !== undefined && typeof configCallback === 'function') {
        configCallback(instance);
    }

    return new Promise(function (resolve, reject) {
        instance.loadConfig().then(function (data) {
            instance.setAll(data);
            resolve();
        });
    })['catch'](function () {
        reject(new Error('Configuration file could not be loaded'));
    });
}

exports.Configure = _configure.Configure;