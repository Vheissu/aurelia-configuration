'use strict';

System.register(['./configure'], function (_export, _context) {
    var Configure;
    return {
        setters: [function (_configure) {
            Configure = _configure.Configure;
        }],
        execute: function () {
            function configure(aurelia, configCallback) {
                var instance = aurelia.container.get(Configure);

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

            _export('configure', configure);

            _export('Configure', Configure);
        }
    };
});