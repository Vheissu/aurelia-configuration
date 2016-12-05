'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Configure = undefined;
exports.configure = configure;

var _configure = require('./configure');

function configure(aurelia, configCallback) {
    var instance = aurelia.container.get(_configure.Configure);
    var promise = null;

    if (configCallback !== undefined && typeof configCallback === 'function') {
        promise = Promise.resolve(configCallback(instance));
    }

    return promise.then(function () {
        return instance.loadConfig();
    }).catch(function () {
        throw new Error('Configuration file could not be loaded');
    });
}

exports.Configure = _configure.Configure;