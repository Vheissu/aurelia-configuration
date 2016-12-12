"use strict";
var aurelia_path_1 = require("aurelia-path");
var deep_extend_1 = require("./deep-extend");
var AureliaConfiguration = (function () {
    function AureliaConfiguration() {
        this.environment = 'default';
        this.environments = null;
        this.directory = 'config';
        this.config_file = 'config.json';
        this.cascade_mode = true;
        this._config_object = {};
        this._config_merge_object = {};
    }
    /**
     * Set Directory
     *
     * Sets the location to look for the config file
     *
     * @param path
     */
    AureliaConfiguration.prototype.setDirectory = function (path) {
        this.directory = path;
    };
    /**
     * Set Config
     *
     * Sets the filename to look for in the defined directory
     *
     * @param name
     */
    AureliaConfiguration.prototype.setConfig = function (name) {
        this.config_file = name;
    };
    /**
     * Set Environment
     *
     * Changes the environment value
     *
     * @param environment
     */
    AureliaConfiguration.prototype.setEnvironment = function (environment) {
        this.environment = environment;
    };
    /**
     * Set Environments
     *
     * Specify multiple environment domains to allow for
     * dynamic environment switching.
     *
     * @param environments
     */
    AureliaConfiguration.prototype.setEnvironments = function (environments) {
        if (environments === void 0) { environments = null; }
        if (environments !== null) {
            this.environments = environments;
            // Check the hostname value and determine our environment
            this.check();
        }
    };
    /**
     * Set Cascade Mode
     *
     * By default if a environment config value is not found, it will
     * go looking up the config file to find it (a la inheritance style). Sometimes
     * you just want a config value from a specific environment and nowhere else
     * use this to disabled this functionality
     *
     * @param bool
     */
    AureliaConfiguration.prototype.setCascadeMode = function (bool) {
        if (bool === void 0) { bool = true; }
        this.cascade_mode = bool;
    };
    Object.defineProperty(AureliaConfiguration.prototype, "obj", {
        /**
         * Get Config
         * Returns the entire configuration object pulled and parsed from file
         *
         * @returns {V}
         */
        get: function () {
            return this._config_object;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AureliaConfiguration.prototype, "config", {
        /**
         * Get Config
         *
         * Get the config file name
         *
         * @returns {V}
         */
        get: function () {
            return this.config_file;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Is
     *
     * A method for determining if the current environment
     * equals that of the supplied environment value*
     * @param environment
     * @returns {boolean}
     */
    AureliaConfiguration.prototype.is = function (environment) {
        return (environment === this.environment);
    };
    /**
     * Check
     * Looks for a match of the hostName to any of the domain
     * values specified during the configuration bootstrapping
     * phase of Aurelia.
     *
     */
    AureliaConfiguration.prototype.check = function () {
        var hostname = window.location.hostname;
        // Check we have environments we can loop
        if (this.environments) {
            // Loop over supplied environments
            for (var env in this.environments) {
                // Get environment hostnames
                var hostnames = this.environments[env];
                // Make sure we have hostnames
                if (hostnames) {
                    // Loop the hostnames
                    for (var _i = 0, hostnames_1 = hostnames; _i < hostnames_1.length; _i++) {
                        var host = hostnames_1[_i];
                        if (hostname.search(host) !== -1) {
                            this.setEnvironment(env);
                            // We have successfully found an environment, stop searching
                            return;
                        }
                    }
                }
            }
        }
    };
    /**
     * Environment Enabled
     * A handy method for determining if we are using the default
     * environment or have another specified like; staging
     *
     * @returns {boolean}
     */
    AureliaConfiguration.prototype.environmentEnabled = function () {
        return (!(this.environment === 'default' || this.environment === '' || !this.environment));
    };
    /**
     * Environment Exists
     * Checks if the environment section actually exists within
     * the configuration file or defaults to default
     *
     * @returns {boolean}
     */
    AureliaConfiguration.prototype.environmentExists = function () {
        return this.environment in this.obj;
    };
    /**
     * Get
     * Gets a configuration value from the main config object
     * with support for a default value if nothing found
     *
     * @param key
     * @param defaultValue
     * @returns {*}
     */
    AureliaConfiguration.prototype.get = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        // By default return the default value
        var returnVal = defaultValue;
        // Singular non-namespaced value
        if (key.indexOf('.') === -1) {
            // Using default environment
            if (!this.environmentEnabled()) {
                return this.obj[key] ? this.obj[key] : defaultValue;
            }
            if (this.environmentEnabled()) {
                // Value exists in environment
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
    /**
     * Set
     * Saves a config value temporarily
     *
     * @param key
     * @param val
     */
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
    /**
     * Merge
     *
     * Allows you to merge in configuration options.
     * This method might be used to merge in server-loaded
     * configuration options with local ones.
     *
     * @param obj
     *
     */
    AureliaConfiguration.prototype.merge = function (obj) {
        var currentConfig = this._config_object;
        this._config_object = deep_extend_1.default(currentConfig, obj);
    };
    /**
     * Lazy Merge
     *
     * Allows you to merge in configuration options.
     * This method might be used to merge in server-loaded
     * configuration options with local ones. The merge
     * occurs after the config has been loaded.
     *
     * @param obj
     *
     */
    AureliaConfiguration.prototype.lazyMerge = function (obj) {
        var currentMergeConfig = (this._config_merge_object || {});
        this._config_merge_object = deep_extend_1.default(currentMergeConfig, obj);
    };
    /**
     * Set All
     * Sets and overwrites the entire configuration object
     * used internally, but also can be used to set the configuration
     * from outside of the usual JSON loading logic.
     *
     * @param obj
     */
    AureliaConfiguration.prototype.setAll = function (obj) {
        this._config_object = obj;
    };
    /**
     * Get All
     * Returns all configuration options as an object
     *
     * @returns {V}
     */
    AureliaConfiguration.prototype.getAll = function () {
        return this.obj;
    };
    /**
     * Load Config
     * Loads the configuration file from specified location,
     * merges in any overrides, then returns a Promise.
     *
     * @returns {Promise}
     */
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
    /**
     * Load Config File
     * Loads the configuration file from the specified location
     * and then returns a Promise.
     *
     * @returns {Promise}
     */
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
    /**
     * Merge Config File
     *
     * Allows you to merge in configuration options from a file.
     * This method might be used to merge in server-loaded
     * configuration options with local ones.
     *
     * @param path      The path to the config file to load.
     * @param optional  When true, errors encountered while loading the config file will be ignored.
     *
     */
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
exports.AureliaConfiguration = AureliaConfiguration;
