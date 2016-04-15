var _dec, _class;

import { inject } from 'aurelia-dependency-injection';
import { join } from 'aurelia-path';
import { Loader } from 'aurelia-loader-default';
import deepExtend from 'deep-extend';

export let Configure = (_dec = inject(Loader), _dec(_class = class Configure {

    constructor(loader) {
        this.loader = loader;

        this.environment = 'default';
        this.environments = false;
        this.directory = 'config';
        this.config_file = 'config.json';
        this.cascade_mode = true;

        this._config_object = {};
    }

    setDirectory(path) {
        this.directory = path;
    }

    setConfig(name) {
        this.config_file = name;
    }

    setEnvironment(environment) {
        this.environment = environment;
    }

    setEnvironments(environments = false) {
        if (environments) {
            this.environments = environments;

            this.check();
        }
    }

    setCascadeMode(bool = true) {
        this.cascade_mode = bool;
    }

    get obj() {
        return this._config_object;
    }

    get config() {
        return this.config_file;
    }

    is(environment) {
        return environment === this.environment;
    }

    check() {
        let hostname = window.location.hostname;

        if (this.environments) {
            for (let env in this.environments) {
                let hostnames = this.environments[env];

                if (hostnames) {
                    for (let host of hostnames) {
                        if (hostname.search(host) !== -1) {
                            this.setEnvironment(env);

                            return;
                        }
                    }
                }
            }
        }
    }

    environmentEnabled() {
        return !(this.environment === 'default' || this.environment === '' || !this.environment);
    }

    environmentExists() {
        return this.environment in this.obj;
    }

    get(key, defaultValue = null) {
        let returnVal = defaultValue;

        if (key.indexOf('.') === -1) {
            if (!this.environmentEnabled()) {
                return this.obj[key] ? this.obj[key] : defaultValue;
            } else {
                if (this.environmentExists() && this.obj[this.environment][key]) {
                    returnVal = this.obj[this.environment][key];
                } else if (this.cascade_mode && this.obj[key]) {
                        returnVal = this.obj[key];
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
                    } else if (this.cascade_mode && this.obj[parent] && this.obj[parent][child]) {
                        returnVal = this.obj[parent][child];
                    }
                }

                return returnVal;
            }
        }
    }

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

    merge(obj) {
        let currentConfig = this._config_object;

        this._config_object = deepExtend(currentConfig, obj);
    }

    lazyMerge(obj) {
        let currentMergeConfig = this._config_merge_object || {};

        this._config_merge_object = deepExtend(currentMergeConfig, obj);
    }

    setAll(obj) {
        this._config_object = obj;
    }

    getAll() {
        return this.obj;
    }

    loadConfig() {
        return this.loadConfigFile(join(this.directory, this.config), data => this.setAll(data)).then(() => {
            if (this._config_merge_object) {
                this.merge(this._config_merge_object);
                this._config_merge_object = null;
            }
        });
    }

    loadConfigFile(path, action) {
        let pathClosure = path.toString();

        return this.loader.loadText(pathClosure).then(data => {
            if (typeof data !== 'object') {
                data = JSON.parse(data);
            }
            action(data);
        }).catch(() => {
            console.log(`Configuration file could not be found or loaded: ${ pathClosure }`);
        });
    }

    mergeConfigFile(path) {
        return this.loadConfigFile(path, data => this.lazyMerge(data));
    }
}) || _class);