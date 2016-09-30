"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
var aurelia_path_1 = require('aurelia-path');
var deep_extend_1 = require('deep-extend');
var Configure = (function () {
    function Configure() {
        this.environment = 'default';
        this.directory = 'config';
        this.config_file = 'config.json';
        this.cascade_mode = true;
        this.environment = 'default';
        this.environments = false;
        this.directory = 'config';
        this.config_file = 'config.json';
        this.cascade_mode = true;
        this._config_object = {};
    }
    Configure.prototype.setDirectory = function (path) {
        this.directory = path;
    };
    Configure.prototype.setConfig = function (name) {
        this.config_file = name;
    };
    Configure.prototype.setEnvironment = function (environment) {
        this.environment = environment;
    };
    Configure.prototype.setEnvironments = function (environments) {
        if (environments === void 0) { environments = false; }
        if (environments) {
            this.environments = environments;
            this.check();
        }
    };
    Configure.prototype.setCascadeMode = function (bool) {
        if (bool === void 0) { bool = true; }
        this.cascade_mode = bool;
    };
    Object.defineProperty(Configure.prototype, "obj", {
        get: function () {
            return this._config_object;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Configure.prototype, "config", {
        get: function () {
            return this.config_file;
        },
        enumerable: true,
        configurable: true
    });
    Configure.prototype.is = function (environment) {
        return (environment === this.environment);
    };
    Configure.prototype.check = function () {
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
    Configure.prototype.environmentEnabled = function () {
        return (!(this.environment === 'default' || this.environment === '' || !this.environment));
    };
    Configure.prototype.environmentExists = function () {
        return this.environment in this.obj;
    };
    Configure.prototype.get = function (key, defaultValue) {
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
    Configure.prototype.set = function (key, val) {
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
    Configure.prototype.merge = function (obj) {
        var currentConfig = this._config_object;
        this._config_object = deep_extend_1.default(currentConfig, obj);
    };
    Configure.prototype.lazyMerge = function (obj) {
        var currentMergeConfig = (this._config_merge_object || {});
        this._config_merge_object = deep_extend_1.default(currentMergeConfig, obj);
    };
    Configure.prototype.setAll = function (obj) {
        this._config_object = obj;
    };
    Configure.prototype.getAll = function () {
        return this.obj;
    };
    Configure.prototype.loadConfig = function () {
        var _this = this;
        return this.loadConfigFile(aurelia_path_1.join(this.directory, this.config), function (data) { return _this.setAll(data); })
            .then(function () {
            if (_this._config_merge_object) {
                _this.merge(_this._config_merge_object);
                _this._config_merge_object = null;
            }
        });
    };
    Configure.prototype.loadConfigFile = function (path, action) {
        return new Promise(function (resolve, reject) {
            var pathClosure = path.toString();
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.open('GET', pathClosure, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var data = JSON.parse(this.responseText);
                    action(data);
                    resolve(data);
                }
            };
            xhr.onerror = function () {
                reject("Configuration file could not be found or loaded: " + pathClosure);
            };
            xhr.send(null);
        });
    };
    Configure.prototype.mergeConfigFile = function (path) {
        var _this = this;
        return this.loadConfigFile(path, function (data) { return _this.lazyMerge(data); });
    };
    Configure = __decorate([
        aurelia_dependency_injection_1.autoinject, 
        __metadata('design:paramtypes', [])
    ], Configure);
    return Configure;
}());
exports.Configure = Configure;
//# sourceMappingURL=configure.js.map