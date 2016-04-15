'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Configure = undefined;
exports.configure = configure;

var _configure = require('./configure');

function configure(aurelia, configCallback) {
    var instance = aurelia.container.get(_configure.Configure);

    if (configCallback !== undefined && typeof configCallback === 'function') {
        configCallback(instance);
    }

    return new Promise(function (resolve, reject) {
        instance.loadConfig().then(function () {
            return resolve();
        }).catch(function () {
            reject(new Error('Configuration file could not be loaded'));
        });
    });
}

exports.Configure = _configure.Configure;