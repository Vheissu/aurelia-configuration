System.register(['./configure'], function (_export) {
    'use strict';

    var Configure;

    _export('configure', configure);

    function configure(aurelia, configCallback) {
        var instance = aurelia.container.get(Configure);

        if (configCallback !== undefined && typeof configCallback === 'function') {
            configCallback(instance);
        }

        return new Promise(function (resolve, reject) {
            instance.loadConfig().then(function (data) {
                data = JSON.parse(data);
                instance.setAll(data);
                resolve();
            });
        })['catch'](function () {
            reject(new Error('Configuration file could not be loaded'));
        });
    }

    return {
        setters: [function (_configure) {
            Configure = _configure.Configure;
        }],
        execute: function () {
            _export('Configure', Configure);
        }
    };
});