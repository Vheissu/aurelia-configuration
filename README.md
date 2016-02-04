# Aurelia-Configuration
A smart configuration plugin and singleton service layer for your Aurelia applications.

## Get Started

* Install aurelia-configuration

```bash
jspm install aurelia-configuration
```

* Use the plugin in your app's main.js:

```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration');

    aurelia.start().then(a => a.setRoot());
}
```

* Create a config file. By default the plugin will assume a configuration file called: application.json inside of a root directory called "config" - the contents of the JSON file can be anything you like as long as it is a JSON object. You can configure the plugin to use a different config file if you like. You can also specify a JSON endpoint (which we'll demo further down) to get get JSON config options from a server.

```json
{
    "name": "Test Application",
    "version": "1.2",
    "api": {
        "key": "somekey",
        "endpoint": "http://www.google.com/"
    }
}
```

* Using with your ViewModel:

```javascript
import {inject} from 'aurelia-framework';
import {Configure} from 'aurelia-configuration';

@inject(Configure)
export class ViewModel {
    constructor(config) {
        this.config = config;

        // Get configuration data using this.config
        // Single non-namespace item:
            this.config.get('name') // Using above sample config would return 'Test Application'
        // Single namespaced item:
            this.config.get('api.key') // Using above sample config would return 'somekey'

        // Setting a temporary config value non-namespaced:
            this.config.set('newkey', 'surprise!') // Would store a value of 'surprise!' on object {newkey: 'surprise!'}
        // Setting a temporary config value namespaced:
            this.config.set('websites.name', 'Google'); // Would store a value of 'Google' on object {websites: {name: 'Google'}}
    }
}
```

## Configuration
The Aurelia Configuration plugin allows you to configure during the bootstrapping phase.

### Changing environment
The concept of environment configuration exists within this plugin. By default the plugin assumes assumes development as its environment, however you can have different levels of environment config values which you can configure the plugin to look in first.

```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration', config => {
            config.setEnvironment('development'); // Environment changes to development
        });

    aurelia.start().then(a => a.setRoot());
}
```

If a value is not found inside of a configuration group, it will attempt to look for it further up the configuration file. Situations where this might be useful is different API details for different environments.

```json
{
    "name": "Test Application",
    "api": {
        "key": "somekey",
        "endpoint": "http://www.google.com/"
    },
    "development": {
        "api": {
            "key": "developmentonlykey938109283091",
            "endpoint": "http://localhost/api/v1"
        },
    }
}
```

If you have specified a particular environment and a config value does not exist, it will look for it further up the config file. For example if you have your environment set to "development" and you request an API key but it isn't specified and you have a value specified further up, it will use that.

The idea is environment specific config values extend parent values, similar to what Ruby on Rails does with its configuration. By default this behavior is turned on, but if you don't want values to be searched outside of your specified environment, disable cascading (below).

#### Dynamic Environment Switching
Manually specifying an environment might not be as efficient in all cases. In this instance you can configure the plugin to dynamically change your environment based on the current URL. Doing so requires specifying one or more domains for particular environments.

```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration', config => {
            config.setEnvironments({
                development: {
                    json: 'config.development.json',
                    hostnames: ['localhost', 'dev.local']
                },
                staging: {
                    json: 'config.staging.json',
                    hostnames: ['staging.website.com', 'test.staging.website.com']
                },
                production: {
                    json: 'config.production.json',
                    hostnames: ['website.com']
                }  
            });
        });

    aurelia.start().then(a => a.setRoot());
}
```

### Specifying an endpoint
Sometimes you want to load values from a server endpoint.

### Changing directory
If you want to change the location of where your configuration files are loaded from, you configure it during the bootstrapping phase within your ``main.js``.

```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration', config => {
            config.setDirectory('config-files'); // Will make plugin look for config files in a directory called "config-files"
        });

    aurelia.start().then(a => a.setRoot());
}
```

### Changing cascade mode
By default, if you're using an environment value using setEnvironment, then by default if a value is not found in a particular environment it will search for it further up the configuration file sort of like inheritance. You might not want this behaviour by default, so you can turn it off by using the ``setCascadeMode`` method.

```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration', config => {
            config.setCascadeMode(false); // Disable value cascading
        });

    aurelia.start().then(a => a.setRoot());
}
```

## API
The Aurelia Configuration plugin is quite simple, there are only a few methods which you will commonly use.

### setDirectory(name)
A method for setting the location of configuration files. This method is made to be called within the bootstrapping phase.

**Usage:**
```javascript
config.setDirectory('config');
```

### setConfig(fileName)
A method for setting the name of the configuration file to load. This method is made to be called within the bootstrapping phase.

**Usage:**
```javascript
config.setConfig('application.json');
```

### setEnvironment(environment)
A method for setting the default environment. This method is designed to work within the bootstrapping phase and throughout your application.

**Usage:**
```javascript
config.setEnvironment('development');
```

### setEnvironments(environments)
A method for setting dynamic environments. This method is designed to work within the bootstrapping phase. You can have as many custom environments as you like by defining a new object property and supplying an array of values.

The environments are defined within an object where the supplied property is the environment and then json and hostnames values. The json property accepts either the name of a JSON file or a HTTP endpoint.

**Usage:**
```javascript
config.setEnvironments({
    development: {
        json: 'config.development.json',
        hostnames: ['localhost', 'dev.local']
    },
    staging: {
        json: 'config.staging.json',
        hostnames: ['staging.website.com', 'test.staging.website.com']
    },
    production: {
        json: 'config.production.json',
        hostnames: ['website.com']
    }  
});
```

### is(environment)
A method for determining if the current environment matches that of the supplied environment value. The below example will return true if the current environment is 'development' or false if it is not. Handy for doing conditional checks based on environment in your application.

**Usage:**
```javascript
var currentEnv = config.is('development');
```

### get(key, defaultValue = null)
A method for getting a configuration value by its key from the config file. Has an optional parameter for returning a default value if the config value could not be found. This method supports namespaced config values as well.

**Usage:**
```javascript
var myVal = config.get('name', 'Default Name'); // If name doesn't exist, will return 'Default Name' as its value
var myVal2 = config.get('name'); // If name doesn't exist, will return null as no default value has been specified
var myVal3 = config.get('api.key', '12345678'); // Will look for "api": {"key": ""} in the configuration file and return default value if not found
var myVal4 = config.get('api.key'); // Will look for "api": {"key": ""} in the configuration file and return null if not found
```

### set(key, val, environment)
A method for temporarily setting a configuration value. Allows you to overwrite existing values. This will not persist changes back to the file.

**Usage:**
```javascript
config.set('name', 'New Name');
```

Optionally, you can also specify a third optional value for the environment. By default it is assumed you're setting a value for the current environment, but sometimes this might not be the desirable action.

### setAll(obj, merge)
A method used by the plugin itself. Will set the configration object with support for deep merging.

**Usage:**
```javascript
config.setAll({mykey: "myval"});
```

### getAll()
A method to get all configuration options pulled from the configuration file.

**Usage:**
```javascript
var myConfigValues = config.getAll();
```

## Dependencies

* [aurelia-dependency-injection](https://github.com/aurelia/dependency-injection)
* [aurelia-http-client](https://github.com/aurelia/http-client)
* [aurelia-event-aggregator](https://github.com/aurelia/event-aggregator)

## Building from src

To build this plugin from the source, follow these steps.

* Ensure that you have [Node.js](http://nodejs.org) installed. This is what our tooling will depend on to compile the plugin.

* Inside of the project folder, execute the following command:

```shell
npm install
```

* Ensure that you have Gulp installed globally, using the following command:

```shell
npm install -g gulp
```

* Ensure that you have JSPM installed globally, using the following command:

```shell
npm install -g jspm
```

* To build the plugin, run:

```shell
gulp build
```

* You will then find the compiled code in the 'dist' folder, in three different module formats: AMD, CommonJS and ES6.

## Running The Tests

To run the unit tests (there are none currently), please make sure you follow the above steps and then follow each step below to get the testing environment setup.

* Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If it is not installed, then install it using the following command:

  ```shell
  npm install -g karma-cli
  ```

* Install the client-side dependencies with JSPM:

  ```shell
  jspm install
  ```
* You can now run the tests with this command:

  ```shell
  karma start
  ```
