define(['exports', './configure'], function (exports, _configure) {
    'use strict';

    exports.__esModule = true;
    exports.configure = configure;

    function configure(aurelia, configCallback) {
        aurelia.container.registerInstance(_configure.Configure, _configure.Configure);
    }

    exports.Configure = _configure.Configure;
});