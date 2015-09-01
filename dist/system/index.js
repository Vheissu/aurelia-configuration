System.register(['./configure'], function (_export) {
    'use strict';

    var Configure;

    _export('configure', configure);

    function configure(aurelia) {
        var instance = aurelia.container.get(Configure);
        aurelia.container.registerInstance(Configure, instance);
    }

    return {
        setters: [function (_configure) {
            Configure = _configure.Configure;
        }],
        execute: function () {}
    };
});