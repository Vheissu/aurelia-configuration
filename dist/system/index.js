'use strict';

System.register(['./configure'], function (_export, _context) {
    "use strict";

    var Configure;
    function configure(aurelia, configCallback) {
        var instance = aurelia.container.get(Configure);
        var promise = null;

        if (configCallback !== undefined && typeof configCallback === 'function') {
            promise = Promise.resolve(configCallback(instance));
        }

        return promise.then(function () {
            return instance.loadConfig();
        }).catch(function () {
            reject(new Error('Configuration file could not be loaded'));
        });
    }

    _export('configure', configure);

    return {
        setters: [function (_configure) {
            Configure = _configure.Configure;
        }],
        execute: function () {
            _export('Configure', Configure);
        }
    };
});