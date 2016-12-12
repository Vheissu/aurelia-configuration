define(["require", "exports", "./aurelia-configuration"], function (require, exports, aurelia_configuration_1) {
    "use strict";
    exports.AureliaConfiguration = aurelia_configuration_1.AureliaConfiguration;
    function configure(aurelia, configCallback) {
        var instance = aurelia.container.get(aurelia_configuration_1.AureliaConfiguration);
        var promise = null;
        // Do we have a callback function?
        if (configCallback !== undefined && typeof (configCallback) === 'function') {
            promise = Promise.resolve(configCallback(instance));
        }
        else {
            promise = Promise.resolve();
        }
        // Don't load the config until the configCallback has completed.
        return promise
            .then(function () {
            return instance.loadConfig();
        })
            .catch(function () {
            throw new Error('Configuration file could not be loaded');
        });
    }
    exports.configure = configure;
});
