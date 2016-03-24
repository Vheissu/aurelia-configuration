import {inject} from 'aurelia-dependency-injection';
import {join} from 'aurelia-path';
import {Loader} from 'aurelia-loader';
import deepExtend from 'deep-extend';

@inject(Loader)
export class Configure {
    
    constructor(loader) {
        // Injected dependencies
        this.loader = loader;
        
        this.environment = 'default';
        this.environments = false;
        this.directory = 'config';
        this.config_file = 'config.json';
        this.cascade_mode = true;
        
        this._config_object = {};
    }

    /**
     * Set Directory
     * 
     * Sets the location to look for the config file
     *
     * @param path
     */
    setDirectory(path) {
        this.directory = path;
    }

    /**
     * Set Config
     * 
     * Sets the filename to look for in the defined directory
     *
     * @param name
     */
    setConfig(name) {
        this.config_file = name;
    }

    /**
     * Set Environment
     * 
     * Changes the environment value
     *
     * @param environment
     */
    setEnvironment(environment) {
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
     setEnvironments(environments = false) {
         if (environments) {
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
    setCascadeMode(bool = true) {
        this.cascade_mode = bool;
    }

    /**
     * Get Config
     * 
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
    is(environment) {
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
                        if (hostname.search(host) !== -1) {
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
        return (this.environment === 'default' || this.environment === '' || !this.environment) ? false : true;
    }

    /**
     * Environment Exists
     * Checks if the environment section actually exists within
     * the configuration file or defaults to default
     *
     * @returns {boolean}
     */
    environmentExists() {
        return (typeof this.obj[this.environment] === undefined) ? false : true;
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
    get(key, defaultValue = null) {
        // By default return the default value
        let returnVal = defaultValue;

        // Singular non-namespaced value
        if (key.indexOf('.') === -1) {
            // Using default environment
            if (!this.environmentEnabled()) {
                return this.obj[key] ? this.obj[key] : defaultValue;
            } else {
                if (this.environmentExists()) {
                    // Value exists in environment
                    if (this.obj[this.environment][key]) {
                        returnVal = this.obj[this.environment][key];
                    // Get default value from non-namespaced section if enabled
                    } else if (this.cascadeMode && this.obj[key]) {
                        returnVal = this.obj[key];
                    }
                }

                return returnVal;
            }
        } else {
            let splitKey = key.split('.');
            let parent = splitKey[0];
            let child = splitKey[1];

            if (!this.environmentEnabled()) {
                if (this.obj[parent]) {
                    return this.obj[parent][child] ? this.obj[parent][child] : defaultValue;
                }
            } else {
                if (this.environmentExists()) {
                    if (this.obj[this.environment][parent] && this.obj[this.environment][parent][child]) {
                        returnVal = this.obj[this.environment][parent][child];
                    } else if (this.cascadeMode && this.obj[parent] && this.obj[parent][child]) {
                        returnVal = this.obj[parent][child];
                    }
                }

                return returnVal;
            }
        }
    }

    /**
     * Set
     * Saves a config value temporarily
     *
     * @param key
     * @param val
     */
    set(key, val) {
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
    merge(obj) {
        let currentConfig = this._config_object;
        let merged = deepExtend(currentConfig, obj);
        
        this._config_object = merged;       
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
    lazyMerge(obj) {
        let currentMergeConfig = (this._config_merge_object || {});
        let merged = deepExtend(currentMergeConfig, obj);
        
        this._config_merge_object = merged;       
    }

    /**
     * Set All
     * Sets and overwrites the entire configuration object
     * used internally, but also can be used to set the configuration
     * from outside of the usual JSON loading logic.
     *
     * @param obj
     */
    setAll(obj) {
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
        return this.loadConfigFile(join(this.directory, this.config), data => this.setAll(data))
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
    loadConfigFile(path, action) {
        let pathClosure = path.toString();
        
        return this.loader.loadText(pathClosure)
            .then(data => {
                data = JSON.parse(data);
                action(data);
            })
            .catch(() => { 
                console.log(`Configuration file could not be found or loaded: ${pathClosure}`);
            });
    }
    
    /**
     * Merge Config File
     * 
     * Allows you to merge in configuration options from a file.
     * This method might be used to merge in server-loaded
     * configuration options with local ones.
     * 
     * @param path
     * 
     */
    mergeConfigFile(path) {
        return this.loadConfigFile(path, data => this.merge(data));
    }
}
