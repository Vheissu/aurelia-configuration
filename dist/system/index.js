System.register(["./configure"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia, configCallback) {
        var instance = aurelia.container.get(configure_1.Configure);
        var promise = null;
        if (configCallback !== undefined && typeof (configCallback) === 'function') {
            promise = configCallback(instance);
        }
        if (promise == null) {
            promise = Promise.resolve();
        }
        return promise
            .then(function () {
            return instance.loadConfig();
        })
            .catch(function () {
            throw new Error('Configuration file could not be loaded.');
        });
    }
    var configure_1;
    exports_1("configure", configure);
    return {
        setters: [
            function (configure_1_1) {
                configure_1 = configure_1_1;
            }
        ],
        execute: function () {
            exports_1("Configure", configure_1.Configure);
        }
    };
});
//# sourceMappingURL=index.js.map