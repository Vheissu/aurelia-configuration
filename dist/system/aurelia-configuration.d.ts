export declare class AureliaConfiguration {
    private environment;
    private environments;
    private directory;
    private config_file;
    private cascade_mode;
    private _config_object;
    private _config_merge_object;
    /**
     * Set Directory
     *
     * Sets the location to look for the config file
     *
     * @param path
     */
    setDirectory(path: string): void;
    /**
     * Set Config
     *
     * Sets the filename to look for in the defined directory
     *
     * @param name
     */
    setConfig(name: string): void;
    /**
     * Set Environment
     *
     * Changes the environment value
     *
     * @param environment
     */
    setEnvironment(environment: string): void;
    /**
     * Set Environments
     *
     * Specify multiple environment domains to allow for
     * dynamic environment switching.
     *
     * @param environments
     */
    setEnvironments(environments?: null): void;
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
    setCascadeMode(bool?: boolean): void;
    /**
     * Get Config
     * Returns the entire configuration object pulled and parsed from file
     *
     * @returns {V}
     */
    readonly obj: any;
    /**
     * Get Config
     *
     * Get the config file name
     *
     * @returns {V}
     */
    readonly config: string;
    /**
     * Is
     *
     * A method for determining if the current environment
     * equals that of the supplied environment value*
     * @param environment
     * @returns {boolean}
     */
    is(environment: string): boolean;
    /**
     * Check
     * Looks for a match of the hostName to any of the domain
     * values specified during the configuration bootstrapping
     * phase of Aurelia.
     *
     */
    check(): void;
    /**
     * Environment Enabled
     * A handy method for determining if we are using the default
     * environment or have another specified like; staging
     *
     * @returns {boolean}
     */
    environmentEnabled(): boolean;
    /**
     * Environment Exists
     * Checks if the environment section actually exists within
     * the configuration file or defaults to default
     *
     * @returns {boolean}
     */
    environmentExists(): boolean;
    /**
     * Get
     * Gets a configuration value from the main config object
     * with support for a default value if nothing found
     *
     * @param key
     * @param defaultValue
     * @returns {*}
     */
    get(key: string, defaultValue?: null): any;
    /**
     * Set
     * Saves a config value temporarily
     *
     * @param key
     * @param val
     */
    set(key: string, val: string): void;
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
    merge(obj: {} | any): void;
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
    lazyMerge(obj: {} | any): void;
    /**
     * Set All
     * Sets and overwrites the entire configuration object
     * used internally, but also can be used to set the configuration
     * from outside of the usual JSON loading logic.
     *
     * @param obj
     */
    setAll(obj: {} | any): void;
    /**
     * Get All
     * Returns all configuration options as an object
     *
     * @returns {V}
     */
    getAll(): any;
    /**
     * Load Config
     * Loads the configuration file from specified location,
     * merges in any overrides, then returns a Promise.
     *
     * @returns {Promise}
     */
    loadConfig(): Promise<void>;
    /**
     * Load Config File
     * Loads the configuration file from the specified location
     * and then returns a Promise.
     *
     * @returns {Promise}
     */
    loadConfigFile(path: string, action: Function): Promise<{}>;
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
    mergeConfigFile(path: string, optional: boolean): Promise<{}>;
}
