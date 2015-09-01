define(['exports', './configure'], function (exports, _configure) {
    'use strict';

    exports.__esModule = true;
    exports.configure = configure;

    function configure(aurelia) {
        var instance = aurelia.container.get(_configure.Configure);
        aurelia.container.registerInstance(_configure.Configure, instance);
    }
});