import 'core-js';

import {inject} from 'aurelia-dependency-injection';
import {HttpClient} from 'aurelia-http-client';

// Secure references that can't be changed outside of Configure singleton class
const ENVIRONMENT = new WeakMap();
const ENVIRONMENTS = new WeakMap();
const DIRECTORY = new WeakMap();
const CONFIG_FILE = new WeakMap();
const CONFIG_OBJECT = new WeakMap();
const CASCADE_MODE = new WeakMap();

@inject(HttpClient)
export class Configure {
    constructor(http) {
        // Injected dependencies
        this.http = http;

        CONFIG_OBJECT.set(this, {});

        ENVIRONMENT.set(this, 'default');
        ENVIRONMENTS.set(this, false);
        DIRECTORY.set(this, 'config');
        CONFIG_FILE.set(this, 'application.json');
        CASCADE_MODE.set(this, true);
    }

    /**
     * Set Directory
     * Sets the location to look for the config file
     *
     * @param path (String)
     */
    setDirectory(path) {
        DIRECTORY.set(this, path);
    }

    /**
     * Set Config
     * Sets the filename to look for in the defined directory
     *
     * @param name (String)
     */
    setConfig(name) {
        CONFIG_FILE.set(this, name);
    }

    /**
     * Set Environment
     * Changes the environment value
     *
     * @param environment (String)
     */
    setEnvironment(environment) {
        ENVIRONMENT.set(this, environment);
    }

    /**
     * Set Environments
     * Specify multiple environment domains to allow for
     * dynamic environment switching.
     *
     * @param environments (Object)
     */
     setEnvironments(environments = false) {
         if (environments) {
            ENVIRONMENTS.set(this, environments);

            // Check the hostname value and determine our environment
            this.check();
         }
     }

    /**
     * Set Cascade Mode
     * By default if a environment config value is not found, it will
     * go looking up the config file to find it (a la inheritance style). Sometimes
     * you just want a config value from a specific environment and nowhere else
     * use this to disabled this functionality
     *
     * @param bool (Boolean)
     */
    setCascadeMode(bool = true) {
        CASCADE_MODE.set(this, bool);
    }

    /**
     * Get Config
     * Returns the entire configuration object pulled and parsed from file
     *
     * @returns {V}
     */
    get obj() {
        return CONFIG_OBJECT.get(this);
    }

    /**
     * Get Environment
     * Gets the current environment value
     *
     * @returns {V}
     */
    get environment() {
        return ENVIRONMENT.get(this);
    }

    /**
     * Get Environments
     * Gets any user supplied environment mappings
     *
     * @returns {array}
     */
    get environments() {
        return ENVIRONMENTS.get(this);
    }

    /**
     * Get Cascade Mode
     * Gets the current cascade mode boolean
     * @returns {boolean}
     */
    get cascadeMode() {
        return CASCADE_MODE.get(this);
    }

    /**
     * Get Directory
     * Gets the current directory
     *
     * @returns {V}
     */
    get directory() {
        return DIRECTORY.get(this);
    }

    /**
     * Get Config
     * Get the config file name
     *
     * @returns {V}
     */
    get config() {
        return CONFIG_FILE.get(this);
    }

    /**
     * Is
     * A method for determining if the current environment
     * equals that of the supplied environment value*
     * @param environment (String)
     * @returns {Boolean}
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
     * @returns {Boolean}
     */
    environmentEnabled() {
        return (this.environment === 'default' || this.environment === '' || !this.environment) ? false : true;
    }

    /**
     * Environment Exists
     * Checks if the environment section actually exists within
     * the configuration file or defaults to default
     *
     * @returns {Boolean}
     */
    environmentExists() {
        return (typeof this.obj[this.environment] === undefined) ? false : true;
    }

    /**
     * Get
     * Gets a configuration value from the main config object
     * with support for a default value if nothing found
     *
     * @param key (String)
     * @param defaultValue (String)
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
     * @param key (String)
     * @param val (Mixed)
     */
    set(key, val) {
        if (key.indexOf('.') === -1) {
            this.obj[key] = val;
        } else {
            let splitKey = key.split('.');
            let parent = splitKey[0];
            let child = splitKey[1];

            this.obj[parent][child] = val;
        }
    }

    /**
     * Set All
     * A dangerous method that sets the entire config object
     * only used during bootstrapping phase
     *
     * @param obj (Object)
     */
    setAll(obj) {
        CONFIG_OBJECT.set(this, obj);
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
     * Loads the configuration file from specified location
     * and then returns a Promise
     *
     * @returns {Promise}
     */
    loadConfig() {
        return new Promise((resolve, reject) => {
            this.http
              .get(`${this.directory}/${this.config}`)
              .then(response => {
                  resolve(response.content);
              })
              .catch(() => reject(new Error('Configuration file could not be found or loaded.')));
        });
    }
}
