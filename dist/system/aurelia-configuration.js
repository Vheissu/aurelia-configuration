System.register(["aurelia-path", "./deep-extend"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aurelia_path_1, deep_extend_1, AureliaConfiguration;
    return {
        setters: [
            function (aurelia_path_1_1) {
                aurelia_path_1 = aurelia_path_1_1;
            },
            function (deep_extend_1_1) {
                deep_extend_1 = deep_extend_1_1;
            }
        ],
        execute: function () {
            AureliaConfiguration = (function () {
                function AureliaConfiguration() {
                    this.environment = 'default';
                    this.environments = null;
                    this.directory = 'config';
                    this.config_file = 'config.json';
                    this.cascade_mode = true;
                    this._config_object = {};
                    this._config_merge_object = {};
                }
                AureliaConfiguration.prototype.setDirectory = function (path) {
                    this.directory = path;
                };
                AureliaConfiguration.prototype.setConfig = function (name) {
                    this.config_file = name;
                };
                AureliaConfiguration.prototype.setEnvironment = function (environment) {
                    this.environment = environment;
                };
                AureliaConfiguration.prototype.setEnvironments = function (environments) {
                    if (environments === void 0) { environments = null; }
                    if (environments !== null) {
                        this.environments = environments;
                        this.check();
                    }
                };
                AureliaConfiguration.prototype.setCascadeMode = function (bool) {
                    if (bool === void 0) { bool = true; }
                    this.cascade_mode = bool;
                };
                Object.defineProperty(AureliaConfiguration.prototype, "obj", {
                    get: function () {
                        return this._config_object;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AureliaConfiguration.prototype, "config", {
                    get: function () {
                        return this.config_file;
                    },
                    enumerable: true,
                    configurable: true
                });
                AureliaConfiguration.prototype.is = function (environment) {
                    return (environment === this.environment);
                };
                AureliaConfiguration.prototype.check = function () {
                    var hostname = window.location.hostname;
                    if (this.environments) {
                        for (var env in this.environments) {
                            var hostnames = this.environments[env];
                            if (hostnames) {
                                for (var _i = 0, hostnames_1 = hostnames; _i < hostnames_1.length; _i++) {
                                    var host = hostnames_1[_i];
                                    if (hostname.search(host) !== -1) {
                                        this.setEnvironment(env);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                };
                AureliaConfiguration.prototype.environmentEnabled = function () {
                    return (!(this.environment === 'default' || this.environment === '' || !this.environment));
                };
                AureliaConfiguration.prototype.environmentExists = function () {
                    return this.environment in this.obj;
                };
                AureliaConfiguration.prototype.get = function (key, defaultValue) {
                    if (defaultValue === void 0) { defaultValue = null; }
                    var returnVal = defaultValue;
                    if (key.indexOf('.') === -1) {
                        if (!this.environmentEnabled()) {
                            return this.obj[key] ? this.obj[key] : defaultValue;
                        }
                        if (this.environmentEnabled()) {
                            if (this.environmentExists() && this.obj[this.environment][key]) {
                                returnVal = this.obj[this.environment][key];
                            }
                            else if (this.cascade_mode && this.obj[key]) {
                                returnVal = this.obj[key];
                            }
                            return returnVal;
                        }
                    }
                    if (key.indexOf('.') !== -1) {
                        var splitKey = key.split('.');
                        var parent_1 = splitKey[0];
                        var child = splitKey[1];
                        if (!this.environmentEnabled()) {
                            if (this.obj[parent_1]) {
                                return this.obj[parent_1][child] ? this.obj[parent_1][child] : defaultValue;
                            }
                        }
                        else {
                            if (this.environmentExists() && this.obj[this.environment][parent_1] && this.obj[this.environment][parent_1][child]) {
                                returnVal = this.obj[this.environment][parent_1][child];
                            }
                            else if (this.cascade_mode && this.obj[parent_1] && this.obj[parent_1][child]) {
                                returnVal = this.obj[parent_1][child];
                            }
                            return returnVal;
                        }
                    }
                    return returnVal;
                };
                AureliaConfiguration.prototype.set = function (key, val) {
                    if (key.indexOf('.') === -1) {
                        this.obj[key] = val;
                    }
                    else {
                        var splitKey = key.split('.');
                        var parent_2 = splitKey[0];
                        var child = splitKey[1];
                        if (this.obj[parent_2] === undefined) {
                            this.obj[parent_2] = {};
                        }
                        this.obj[parent_2][child] = val;
                    }
                };
                AureliaConfiguration.prototype.merge = function (obj) {
                    var currentConfig = this._config_object;
                    this._config_object = deep_extend_1.default(currentConfig, obj);
                };
                AureliaConfiguration.prototype.lazyMerge = function (obj) {
                    var currentMergeConfig = (this._config_merge_object || {});
                    this._config_merge_object = deep_extend_1.default(currentMergeConfig, obj);
                };
                AureliaConfiguration.prototype.setAll = function (obj) {
                    this._config_object = obj;
                };
                AureliaConfiguration.prototype.getAll = function () {
                    return this.obj;
                };
                AureliaConfiguration.prototype.loadConfig = function () {
                    var _this = this;
                    return this.loadConfigFile(aurelia_path_1.join(this.directory, this.config), function (data) { return _this.setAll(data); })
                        .then(function () {
                        if (_this._config_merge_object) {
                            _this.merge(_this._config_merge_object);
                            _this._config_merge_object = null;
                        }
                    });
                };
                AureliaConfiguration.prototype.loadConfigFile = function (path, action) {
                    return new Promise(function (resolve, reject) {
                        var pathClosure = path.toString();
                        var xhr = new XMLHttpRequest();
                        if (xhr.overrideMimeType) {
                            xhr.overrideMimeType('application/json');
                        }
                        xhr.open('GET', pathClosure, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4 && xhr.status == 200) {
                                var data = JSON.parse(this.responseText);
                                action(data);
                                resolve(data);
                            }
                        };
                        xhr.onloadend = function () {
                            if (xhr.status == 404) {
                                reject('Configuration file could not be found: ' + path);
                            }
                        };
                        xhr.onerror = function () {
                            reject("Configuration file could not be found or loaded: " + pathClosure);
                        };
                        xhr.send(null);
                    });
                };
                AureliaConfiguration.prototype.mergeConfigFile = function (path, optional) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this
                            .loadConfigFile(path, function (data) {
                            _this.lazyMerge(data);
                            resolve();
                        })
                            .catch(function (error) {
                            if (optional === true) {
                                resolve();
                            }
                            else {
                                reject(error);
                            }
                        });
                    });
                };
                return AureliaConfiguration;
            }());
            exports_1("AureliaConfiguration", AureliaConfiguration);
        }
    };
});
//# sourceMappingURL=aurelia-configuration.js.map