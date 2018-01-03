import {join} from 'aurelia-path';
import deepExtend from './deep-extend';

export class AureliaConfiguration {

    private environment: string = 'default';
    private environments: string[] | null = null;
    private directory: string = 'config';
    private config_file: string = 'config.json';
    private cascade_mode: boolean = true;

    private _config_object: {} | any = {};
    private _config_merge_object: {} | any = {};

    /**
     * Set Directory
     *
     * Sets the location to look for the config file
     *
     * @param path
     */
    setDirectory(path: string) {
        this.directory = path;
    }

    /**
     * Set Config
     *
     * Sets the filename to look for in the defined directory
     *
     * @param name
     */
    setConfig(name: string) {
        this.config_file = name;
    }

    /**
     * Set Environment
     *
     * Changes the environment value
     *
     * @param environment
     */
    setEnvironment(environment: string) {
        this.environment = environment;
    }

    /**
     * Set Environments
     *
     * Specify multiple environment domains to allow for
     * dynamic environment switching.
     *
     * @param environments
     */
    setEnvironments(environments: any = null) {
        if (environments !== null) {
            this.environments = environments;

            // Check the hostname value and determine our environment
            this.check();
        }
    }

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
    setCascadeMode(bool: boolean = true) {
        this.cascade_mode = bool;
    }

    /**
     * Get Config
     * Returns the entire configuration object pulled and parsed from file
     *
     * @returns {V}
     */
    get obj() {
        return this._config_object;
    }

    /**
     * Get Config
     *
     * Get the config file name
     *
     * @returns {V}
     */
    get config() {
        return this.config_file;
    }

    /**
     * Is
     *
     * A method for determining if the current environment
     * equals that of the supplied environment value*
     * @param environment
     * @returns {boolean}
     */
    is(environment: string) {
        return (environment === this.environment);
    }

    /**
     * Check
     * Looks for a match of the hostName to any of the domain
     * values specified during the configuration bootstrapping
     * phase of Aurelia.
     *
     */
    check() {
        let hostname = window.location.hostname;
        if (window.location.port != '')
            hostname += ':' + window.location.port;
            
        // Check we have environments we can loop
        if (this.environments) {
            // Loop over supplied environments
            for (let env in this.environments) {
                // Get environment hostnames
                let hostnames = this.environments[env];

                // Make sure we have hostnames
                if (hostnames) {
                    // Loop the hostnames
                    for (let host of hostnames) {
                        if (hostname.search('(?:^|\W)' + host + '(?:$|\W)') !== -1) {
                            this.setEnvironment(env);

                            // We have successfully found an environment, stop searching
                            return;
                        }
                    }
                }
            }
        }
    }

    /**
     * Environment Enabled
     * A handy method for determining if we are using the default
     * environment or have another specified like; staging
     *
     * @returns {boolean}
     */
    environmentEnabled() {
        return (!(this.environment === 'default' || this.environment === '' || !this.environment));
    }

    /**
     * Environment Exists
     * Checks if the environment section actually exists within
     * the configuration file or defaults to default
     *
     * @returns {boolean}
     */
    environmentExists() {
        return this.environment in this.obj;
    }

    /**
     * GetDictValue
     * Gets a value from a dict in an arbitrary depth or throws
     * an error, if the key does not exist
     *
     * @param baseObject
     * @param key
     * @returns {*}
     */
    getDictValue(baseObject: {} | any, key: string) {
        let splitKey = key.split('.');
        let currentObject = baseObject;

        splitKey.forEach((key) => {
            if (currentObject[key]) {
                currentObject = currentObject[key];
            } else {
                throw 'Key ' + key + ' not found';
            }
        });
        return currentObject;
    }

    /**
     * Get
     * Gets a configuration value from the main config object
     * with support for a default value if nothing found
     *
     * @param key
     * @param defaultValue
     * @returns {*}
     */
    get(key: string, defaultValue: any = null) {
        // By default return the default value
        let returnVal = defaultValue;

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
                    // Get default value from non-namespaced section if enabled
                } else if (this.cascade_mode && this.obj[key]) {
                    returnVal = this.obj[key];
                }

                return returnVal;
            }
        } else {
            // nested key and environment is enabled
            if (this.environmentEnabled()) {
                if (this.environmentExists()) {
                    try {
                        return this.getDictValue(this.obj[this.environment], key);
                    } catch {
                        // nested key, env exists, key is not in environment
                        if (this.cascade_mode) {
                            try {
                                return this.getDictValue(this.obj, key);
                            } catch {}
                        }
                    }
                }
            } else {
                try {
                    return this.getDictValue(this.obj, key);
                } catch {}
            }
        }

        return returnVal;
    }

    /**
     * Set
     * Saves a config value temporarily
     *
     * @param key
     * @param val
     */
    set(key: string, val: string) {
        if (key.indexOf('.') === -1) {
            this.obj[key] = val;
        } else {
            let splitKey = key.split('.');
            let parent = splitKey[0];
            let child = splitKey[1];

            if (this.obj[parent] === undefined) {
                this.obj[parent] = {};
            }

            this.obj[parent][child] = val;
        }
    }

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
    merge(obj: {} | any) {
        let currentConfig = this._config_object;

        this._config_object = deepExtend(currentConfig, obj);
    }

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
    lazyMerge(obj: {} | any) {
        let currentMergeConfig = (this._config_merge_object || {});

        this._config_merge_object = deepExtend(currentMergeConfig, obj);
    }

    /**
     * Set All
     * Sets and overwrites the entire configuration object
     * used internally, but also can be used to set the configuration
     * from outside of the usual JSON loading logic.
     *
     * @param obj
     */
    setAll(obj: {} | any) {
        this._config_object = obj;
    }

    /**
     * Get All
     * Returns all configuration options as an object
     *
     * @returns {V}
     */
    getAll() {
        return this.obj;
    }

    /**
     * Load Config
     * Loads the configuration file from specified location,
     * merges in any overrides, then returns a Promise.
     *
     * @returns {Promise}
     */
    loadConfig() {
        return this.loadConfigFile(join(this.directory, this.config), (data: string) => this.setAll(data))
            .then(() => {
                if (this._config_merge_object) {
                    this.merge(this._config_merge_object);
                    this._config_merge_object = null;
                }
            });
    }

    /**
     * Load Config File
     * Loads the configuration file from the specified location
     * and then returns a Promise.
     *
     * @returns {Promise}
     */
    loadConfigFile(path: string, action: Function) {
        return new Promise((resolve, reject) => {
            let pathClosure = path.toString();

            let xhr = new XMLHttpRequest();
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('application/json');
            }
            xhr.open('GET', pathClosure, true);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    let data = JSON.parse(this.responseText);
                    action(data);
                    resolve(data);
                }
            };

            xhr.onloadend = function () {
                if (xhr.status == 404) {
                    reject('Configuration file could not be found: ' + path);
                }
            };

            xhr.onerror = function() {
                reject(`Configuration file could not be found or loaded: ${pathClosure}`);
            };

            xhr.send(null);
        });
    }

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
    mergeConfigFile(path: string, optional: boolean) {
        return new Promise((resolve, reject) => {
            this
                .loadConfigFile(path, (data: {} | any) => {
                    this.lazyMerge(data);
                    resolve();
                })
                .catch(error => {
                    if (optional === true) {
                        resolve();
                    } else {
                        reject(error);
                    }
                });
        });
    }
}
