"use strict";
var configure_1 = require("./configure");
exports.Configure = configure_1.Configure;
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
exports.configure = configure;
//# sourceMappingURL=index.js.map