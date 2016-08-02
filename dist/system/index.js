System.register(['./configure'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var configure_1;
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
    exports_1("configure", configure);
    return {
        setters:[
            function (configure_1_1) {
                configure_1 = configure_1_1;
            }],
        execute: function() {
            exports_1("Configure", configure_1.Configure);
        }
    }
});
//# sourceMappingURL=index.js.map