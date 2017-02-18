define(["require", "exports", "./aurelia-configuration"], function (require, exports, aurelia_configuration_1) {
    "use strict";
    exports.AureliaConfiguration = aurelia_configuration_1.AureliaConfiguration;
    function configure(aurelia, configCallback) {
        var instance = aurelia.container.get(aurelia_configuration_1.AureliaConfiguration);
        var promise = null;
        if (configCallback !== undefined && typeof (configCallback) === 'function') {
            promise = Promise.resolve(configCallback(instance));
        }
        else {
            promise = Promise.resolve();
        }
        return promise
            .then(function () {
            return instance.loadConfig();
        });
    }
    exports.configure = configure;
});
//# sourceMappingURL=index.js.map