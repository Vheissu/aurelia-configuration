import 'core-js';

import {inject} from 'aurelia-dependency-injection';
import {HttpClient} from 'aurelia-http-client';

// Secure references that can't be changed outside of Configure singleton class
const ENVIRONMENT = new WeakMap();
const ENVIRONMENTS = new WeakMap();
const DIRECTORY = new WeakMap();

// An object that stores all of our configuration options
const CONFIG_OBJECT = new WeakMap();

@inject(HttpClient)
export class Configure {
    constructor(http) {
        // Injected dependencies
        this.http = http;

        CONFIG_OBJECT.set(this, {});

        ENVIRONMENT.set(this, 'development');
        DIRECTORY.set(this, 'config');

        ENVIRONMENTS.set(this, {
            development: {
                json: 'application.json',
                hostnames: '*'
            }
        });
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
        let config = this.environments[this.environment];

        return config.file;
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
                let envObj = this.environments[env];

                if (envObj) {
                    if (envObj.hostnames !== '*') {
                        let hostnames = envObj.hostnames;

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
        }
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
        // Singular non-namespaced value
        if (key.indexOf('.') === -1) {
            return this.obj[this.environment][key];
        } else {
            let splitKey = key.split('.');
            let parent = splitKey[0];
            let child = splitKey[1];

            if (this.obj[this.environment][parent] && this.obj[this.environment][parent][child]) {
                return this.obj[this.environment][parent][child];
            }

            return defaultValue;
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
     * @param merge {Boolean}
     */
    setAll(obj, merge = false) {
        var storeObj = obj;

        if (merge) {
            let target = this.obj;
            storeObj = this.deepMerge(target, obj);
        }

        CONFIG_OBJECT.set(this, storeObj);
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

    /**
     * Deep Merge
     * A function for deeply merging objects
     *
     * Method taken from: https://github.com/KyleAMathews/deepmerge
     *
     * @param target (Object)
     * @param src (Object)
     * @returns {Object}
     */
    deepMerge(target, src) {
      var array = Array.isArray(src);
      var dst = array && [] || {};

      if (array) {
          target = target || [];
          dst = dst.concat(target);
          src.forEach((e, i) => {
              if (typeof dst[i] === 'undefined') {
                  dst[i] = e;
              } else if (typeof e === 'object') {
                  dst[i] = this.deepMerge(target[i], e);
              } else {
                  if (target.indexOf(e) === -1) {
                      dst.push(e);
                  }
              }
          });
      } else {
          if (target && typeof target === 'object') {
              Object.keys(target).forEach(key => {
                  dst[key] = target[key];
              })
          }
          Object.keys(src).forEach(key => {
              if (typeof src[key] !== 'object' || !src[key]) {
                  dst[key] = src[key];
              }
              else {
                  if (!target[key]) {
                      dst[key] = src[key];
                  } else {
                      dst[key] = this.deepMerge(target[key], src[key]);
                  }
              }
          });
      }

      return dst;
    }
}
