'use strict';

exports.__esModule = true;
exports.configure = configure;

var _configure = require('./configure');

function configure(aurelia, configCallback) {
    aurelia.container.registerInstance(_configure.Configure, new _configure.Configure());
}