define(['exports', './aurelia-configuration'], function (exports, _aureliaConfiguration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaConfiguration).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaConfiguration[key];
      }
    });
  });
});