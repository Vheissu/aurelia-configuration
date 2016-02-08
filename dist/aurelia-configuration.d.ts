declare module 'aurelia-configuration' {
  import { HttpClient }  from 'aurelia-http-client';
    
  export class Configure {
    constructor(http: HttpClient);
    
    /**
     * Set Directory
     * Sets the location to look for the config file
     *
     * @param path
     */
    setDirectory(path: string): void;
    
    /**
     * Set Config
     * Sets the filename to look for in the defined directory
     *
     * @param name
     */
    setConfig(name: string): void;
    
    /**
     * Set Environment
     * Changes the environment value
     *
     * @param environment
     */
    setEnvironment(environment: string): void;
    
    /**
     * Set Environments
     * Specify multiple environment domains to allow for
     * dynamic environment switching.
     *
     * @param environments
     */
    setEnvironments(environments?: any): void;
    
    /**
     * Set Cascade Mode
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
    obj: any;
    
    /**
     * Get Environment
     * Gets the current environment value
     *
     * @returns {V}
     */
    environment: string;
    
    /**
     * Get Environments
     * Gets any user supplied environment mappings
     *
     * @returns {array}
     */
    environments: string[];
    
    /**
     * Get Cascade Mode
     * Gets the current cascade mode boolean
     * @returns {boolean}
     */
    cascadeMode: boolean;
    
    /**
     * Get Directory
     * Gets the current directory
     *
     * @returns {V}
     */
    directory: string;
    
    /**
     * Get Config
     * Get the config file name
     *
     * @returns {V}
     */
    config: string;
    
    /**
     * Is
     * A method for determining if the current environment
     * equals that of the supplied environment value
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
    get(key: string, defaultValue?: any): any;
    
    /**
     * Set
     * Saves a config value temporarily
     *
     * @param key
     * @param val
     */
    set(key: string, val: any): void;
    
    /**
     * Set All
     * A dangerous method that sets the entire config object
     * only used during bootstrapping phase
     *
     * @param obj
     */
    setAll(obj: any): void;
    
    /**
     * Get All
     * Returns all configuration options as an object
     *
     * @returns {V}
     */
    getAll(): any;
    
    /**
     * Load Config
     * Loads the configuration file from specified location
     * and then returns a Promise
     *
     * @returns {Promise}
     */
    loadConfig(): Promise<any>;
  }
}