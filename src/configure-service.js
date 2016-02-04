export default class ConfigureService {
    _config = {};

    get(key, defaultValue = '') {
        // Singular non-namespaced value
        if (key.indexOf('.') === -1) {
            return this._config[key];
        } else {
            let splitKey = key.split('.');
            let parent = splitKey[0];
            let child = splitKey[1];

            if (this._config[parent] && this._config[parent][child]) {
                return this._config[parent][child];
            }

            return defaultValue;
        }
    }

    /**
     * Set
     * Sets a configuration option on the configuration
     * object variable on this class.
     *
     * @param key {mixed}
     * @param val {mixed}
     * @returns void
     */
    set(key, val) {
        if (key.indexOf('.') === -1) {
            this._config[key] = val;
        } else {
            let splitKey = key.split('.');
            let parent = splitKey[0];
            let child = splitKey[1];

            this._config[parent][child] = val;
        }
    }

    /**
     * Set All
     * Sets the entire configuration object with support
     * for merging configuration options.
     *
     * @param obj (Object)
     * @param merge {Boolean}
     */
    setAll(obj, merge = true) {
        var storeObj = obj;

        if (merge) {
            let target = this._config;
            storeObj = deepMerge(target, obj);
        }

        this._config = storeObj;
    }

    /**
     * Load Config
     * Determines if a configuration file should be
     * loaded remotely or locally
     *
     * @param location {string}
     *
     */
    loadConfig(location) {
        // It's not a remote endpoint
        if (location.indexOf('http') == -1 || location.indexOf('https') == -1) {
            return this._loadLocalJson(location);
        } else {
            return this._loadRemoteJson(location);
        }
    }

    /**
     * Load Local Config
     * Loads a local configuration file using require
     * and the JSON plugin loader for SystemJS
     *
     * @param file {mixed}
     * @returns {Promise}
     */
    _loadLocalJson(file) {
        return new Promise((resolve, reject) => {
            let loaded = require(file);

            resolve(loaded);
        });
    }

    /**
     * Load Remote Json
     * Loads JSON from a remote endpoint
     *
     * @param url {string}
     * @returns {Promise}
     *
     */
    _loadRemoteJson(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.setRequestHeader('Content-Type', 'application/json');
            request.overrideMimeType('application/json');

            request.open('GET', url, true);

            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200 || request.status === 304) {
                        resolve(JSON.parse(request.responseText));
                    } else {
                        reject(new Error('There was an error loading the remote JSON.'));
                    }
                } else {
                    reject(new Error('JSON file could not be loaded'));
                }
            };

            request.send(null);
        });
    }
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
function deepMerge(target, src) {
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
