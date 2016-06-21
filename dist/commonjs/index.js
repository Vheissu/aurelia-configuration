'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaConfiguration = require('./aurelia-configuration');

Object.keys(_aureliaConfiguration).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaConfiguration[key];
    }
  });
});