define(['exports', 'core-js', 'aurelia-dependency-injection', 'aurelia-http-client', 'aurelia-event-aggregator'], function (exports, _coreJs, _aureliaDependencyInjection, _aureliaHttpClient, _aureliaEventAggregator) {
    'use strict';

    exports.__esModule = true;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var ENVIRONMENT = new WeakMap();
    var DIRECTORY = new WeakMap();
    var CONFIG_FILE = new WeakMap();
    var CONFIG_OBJECT = new WeakMap();

    var Configure = (function () {
        function Configure(http, ea) {
            _classCallCheck(this, _Configure);

            this.http = http;
            this.ea = ea;

            CONFIG_OBJECT.set(this, {});

            ENVIRONMENT.set(this, 'DEFAULT');
            DIRECTORY.set(this, 'config');
            CONFIG_FILE.set(this, 'application.json');
        }

        Configure.prototype.setDirectory = function setDirectory(path) {
            DIRECTORY.set(this, path);
        };

        Configure.prototype.setConfig = function setConfig(name) {
            CONFIG_FILE.set(this, name);
        };

        Configure.prototype.environmentEnabled = function environmentEnabled() {
            return this.environment === 'DEFAULT' || this.environment === '' || !this.environment ? false : true;
        };

        Configure.prototype.environmentExists = function environmentExists() {
            return typeof this.obj[this.environment] === undefined ? false : true;
        };

        Configure.prototype.get = function get(key) {
            var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            var returnVal = defaultValue;

            if (key.indexOf('.') === -1) {
                if (!this.environmentEnabled()) {
                    return this.obj[key] ? this.obj[key] : defaultValue;
                } else {
                    if (this.environmentExists() && this.obj[this.environment][key]) {
                        returnVal = this.obj[this.environment][key];
                    } else if (this.obj[key]) {
                            returnVal = this.obj[key];
                        }

                    return returnVal;
                }
            } else {
                var splitKey = key.split('.');
                var _parent = splitKey[0];
                var child = splitKey[1];

                if (!this.environmentEnabled()) {
                    if (this.obj[_parent]) {
                        return this.obj[_parent][child] ? this.obj[_parent][child] : defaultValue;
                    }
                } else {
                    if (this.environmentExists() && this.obj[this.environment][_parent]) {
                        returnVal = this.obj[this.environment][_parent][child];
                    } else if (this.obj[_parent]) {
                        returnVal = this.obj[_parent];
                    }

                    return returnVal;
                }
            }
        };

        Configure.prototype.set = function set(key, val) {
            if (key.indexOf('.') === -1) {
                this.obj[key] = val;
            } else {
                var splitKey = key.split('.');
                var _parent2 = splitKey[0];
                var child = splitKey[1];

                this.obj[_parent2][child] = val;
            }
        };

        Configure.prototype.setAll = function setAll(obj) {
            CONFIG_OBJECT.set(this, obj);
        };

        Configure.prototype.getAll = function getAll() {
            return this.obj;
        };

        Configure.prototype.loadConfig = function loadConfig() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.http.get(_this.directory + '/' + _this.config).then(function (response) {
                    resolve(response.content);
                })['catch'](function () {
                    return reject(new Error('Configuration file could not be found or loaded.'));
                });
            });
        };

        _createClass(Configure, [{
            key: 'obj',
            get: function get() {
                return CONFIG_OBJECT.get(this);
            }
        }, {
            key: 'environment',
            get: function get() {
                return ENVIRONMENT.get(this);
            }
        }, {
            key: 'directory',
            get: function get() {
                return DIRECTORY.get(this);
            }
        }, {
            key: 'config',
            get: function get() {
                return CONFIG_FILE.get(this);
            }
        }]);

        var _Configure = Configure;
        Configure = _aureliaDependencyInjection.inject(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator)(Configure) || Configure;
        return Configure;
    })();

    exports.Configure = Configure;
});