define(['exports', 'core-js', 'aurelia-dependency-injection', 'aurelia-loader'], function (exports, _coreJs, _aureliaDependencyInjection, _aureliaLoader) {
    'use strict';

    exports.__esModule = true;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var ENVIRONMENT = new WeakMap();
    var ENVIRONMENTS = new WeakMap();
    var DIRECTORY = new WeakMap();
    var CONFIG_FILE = new WeakMap();
    var CONFIG_OBJECT = new WeakMap();
    var CASCADE_MODE = new WeakMap();

    var Configure = (function () {
        function Configure(loader) {
            _classCallCheck(this, _Configure);

            this.loader = loader;

            CONFIG_OBJECT.set(this, {});

            ENVIRONMENT.set(this, 'default');
            ENVIRONMENTS.set(this, false);
            DIRECTORY.set(this, 'config');
            CONFIG_FILE.set(this, 'config.json');
            CASCADE_MODE.set(this, true);
        }

        Configure.prototype.setDirectory = function setDirectory(path) {
            DIRECTORY.set(this, path);
        };

        Configure.prototype.setConfig = function setConfig(name) {
            CONFIG_FILE.set(this, name);
        };

        Configure.prototype.setEnvironment = function setEnvironment(environment) {
            ENVIRONMENT.set(this, environment);
        };

        Configure.prototype.setEnvironments = function setEnvironments() {
            var environments = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            if (environments) {
                ENVIRONMENTS.set(this, environments);

                this.check();
            }
        };

        Configure.prototype.setCascadeMode = function setCascadeMode() {
            var bool = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            CASCADE_MODE.set(this, bool);
        };

        Configure.prototype.is = function is(environment) {
            return environment === this.environment;
        };

        Configure.prototype.check = function check() {
            var hostname = window.location.hostname;

            if (this.environments) {
                for (var env in this.environments) {
                    var hostnames = this.environments[env];

                    if (hostnames) {
                        for (var _iterator = hostnames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                            var _ref;

                            if (_isArray) {
                                if (_i >= _iterator.length) break;
                                _ref = _iterator[_i++];
                            } else {
                                _i = _iterator.next();
                                if (_i.done) break;
                                _ref = _i.value;
                            }

                            var host = _ref;

                            if (hostname.search(host) !== -1) {
                                this.setEnvironment(env);
                            }
                        }
                    }
                }
            }
        };

        Configure.prototype.environmentEnabled = function environmentEnabled() {
            return this.environment === 'default' || this.environment === '' || !this.environment ? false : true;
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
                    if (this.environmentExists()) {
                        if (this.obj[this.environment][key]) {
                            returnVal = this.obj[this.environment][key];
                        } else if (this.cascadeMode && this.obj[key]) {
                                returnVal = this.obj[key];
                            }
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
                    if (this.environmentExists()) {
                        if (this.obj[this.environment][_parent] && this.obj[this.environment][_parent][child]) {
                            returnVal = this.obj[this.environment][_parent][child];
                        } else if (this.cascadeMode && this.obj[_parent] && this.obj[_parent][child]) {
                            returnVal = this.obj[_parent][child];
                        }
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

                if (this.obj[_parent2] === undefined) {
                    this.obj[_parent2] = {};
                }

                this.obj[_parent2][child] = val;
            }
        };

        Configure.prototype.merge = function merge(obj) {
            var currentConfig = CONFIG_OBJECT.get(this);
            var merged = Object.assign(currentConfig, obj);

            CONFIG_OBJECT.set(this, merged);
        };

        Configure.prototype.setAll = function setAll(obj) {
            CONFIG_OBJECT.set(this, obj);
        };

        Configure.prototype.getAll = function getAll() {
            return this.obj;
        };

        Configure.prototype.loadConfig = function loadConfig() {
            return this.loader.loadText(this.directory + '/' + this.config)['catch'](function () {
                return reject(new Error('Configuration file could not be found or loaded.'));
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
            key: 'environments',
            get: function get() {
                return ENVIRONMENTS.get(this);
            }
        }, {
            key: 'cascadeMode',
            get: function get() {
                return CASCADE_MODE.get(this);
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
        Configure = _aureliaDependencyInjection.inject(_aureliaLoader.Loader)(Configure) || Configure;
        return Configure;
    })();

    exports.Configure = Configure;
});