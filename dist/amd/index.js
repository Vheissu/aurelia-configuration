define(['exports', './configure'], function (exports, _configure) {
    'use strict';

    exports.__esModule = true;
    exports.configure = configure;

    function configure(aurelia, configCallback) {
        var instance = aurelia.container.get(_configure.Configure);

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
});