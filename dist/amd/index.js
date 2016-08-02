define(["require", "exports", './configure'], function (require, exports, configure_1) {
    "use strict";
    exports.Configure = configure_1.Configure;
    function configure(aurelia, configCallback) {
        var instance = aurelia.container.get(configure_1.Configure);
        if (configCallback !== undefined && typeof (configCallback) === 'function') {
            configCallback(instance);
        }
        return new Promise(function (resolve, reject) {
            instance.loadConfig()
                .then(function () { return resolve(); })
                .catch(function () {
                reject(new Error('Configuration file could not be loaded'));
            });
        });
    }
    exports.configure = configure;
});
//# sourceMappingURL=index.js.map