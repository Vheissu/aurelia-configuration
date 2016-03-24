define(['exports', 'deep-extend', 'aurelia-dependency-injection', 'aurelia-path', 'aurelia-loader'], function (exports, _deepExtend, _aureliaDependencyInjection, _aureliaPath, _aureliaLoader) {
    'use strict';

    exports.__esModule = true;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    exports.configure = configure;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _deepExtend2 = _interopRequireDefault(_deepExtend);

    var Configure = (function () {
        function Configure(loader) {
            _classCallCheck(this, _Configure);

            this.loader = loader;

            this.environment = 'default';
            this.environments = false;
            this.directory = 'config';
            this.config_file = 'config.json';
            this.cascade_mode = true;

            this._config_object = {};
        }

        Configure.prototype.setDirectory = function setDirectory(path) {
            this.directory = path;
        };

        Configure.prototype.setConfig = function setConfig(name) {
            this.config_file = name;
        };

        Configure.prototype.setEnvironment = function setEnvironment(environment) {
            this.environment = environment;
        };

        Configure.prototype.setEnvironments = function setEnvironments() {
            var environments = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

            if (environments) {
                this.environments = environments;

                this.check();
            }
        };

        Configure.prototype.setCascadeMode = function setCascadeMode() {
            var bool = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

            this.cascade_mode = bool;
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

                                return;
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
            var currentConfig = this._config_object;
            var merged = _deepExtend2['default'](currentConfig, obj);

            this._config_object = merged;
        };

        Configure.prototype.lazyMerge = function lazyMerge(obj) {
            var currentMergeConfig = this._config_merge_object || {};
            var merged = _deepExtend2['default'](currentMergeConfig, obj);

            this._config_merge_object = merged;
        };

        Configure.prototype.setAll = function setAll(obj) {
            this._config_object = obj;
        };

        Configure.prototype.getAll = function getAll() {
            return this.obj;
        };

        Configure.prototype.loadConfig = function loadConfig() {
            var _this = this;

            return this.loadConfigFile(_aureliaPath.join(this.directory, this.config), function (data) {
                return _this.setAll(data);
            }).then(function () {
                if (_this._config_merge_object) {
                    _this.merge(_this._config_merge_object);
                    _this._config_merge_object = null;
                }
            });
        };

        Configure.prototype.loadConfigFile = function loadConfigFile(path, action) {
            var pathClosure = path.toString();

            return this.loader.loadText(pathClosure).then(function (data) {
                data = JSON.parse(data);
                action(data);
            })['catch'](function () {
                console.log('Configuration file could not be found or loaded: ' + pathClosure);
            });
        };

        Configure.prototype.mergeConfigFile = function mergeConfigFile(path) {
            var _this2 = this;

            return this.loadConfigFile(path, function (data) {
                return _this2.merge(data);
            });
        };

        _createClass(Configure, [{
            key: 'obj',
            get: function get() {
                return this._config_object;
            }
        }, {
            key: 'config',
            get: function get() {
                return this.config_file;
            }
        }]);

        var _Configure = Configure;
        Configure = _aureliaDependencyInjection.inject(_aureliaLoader.Loader)(Configure) || Configure;
        return Configure;
    })();

    exports.Configure = Configure;

    function configure(aurelia, configCallback) {
        var instance = aurelia.container.get(Configure);

        if (configCallback !== undefined && typeof configCallback === 'function') {
            configCallback(instance);
        }

        return new Promise(function (resolve, reject) {
            instance.loadConfig().then(function () {
                return resolve();
            })['catch'](function () {
                reject(new Error('Configuration file could not be loaded'));
            });
        });
    }

    exports.Configure = Configure;
});