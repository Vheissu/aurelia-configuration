'use strict';

System.register(['./aurelia-configuration'], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_aureliaConfiguration) {
      var _exportObj = {};

      for (var _key in _aureliaConfiguration) {
        if (_key !== "default") _exportObj[_key] = _aureliaConfiguration[_key];
      }

      _export(_exportObj);
    }],
    execute: function () {}
  };
});