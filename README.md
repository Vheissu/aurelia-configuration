# Aurelia-Configuration
A smart configuration plugin and singleton service layer for your Aurelia applications.

## Get Started

1. Install aurelia-configuration

```bash
jspm install aurelia-configuration=github:vheissu/aurelia-configuration
```

2. Use the plugin in your app's main.js:

```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration');

    aurelia.start().then(a => a.setRoot());
}
```

3. Create a config file. By default the plugin will assume a configuration file called: application.json inside of a root directory called "config" - the contents of the JSON file can be anything you like as long as it is a JSON object. You can configure the plugin to use a different config file if you like.

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

4. Using with your ViewModel:

```javascript
import {inject} from 'aurelia-frameework';
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
The concept of environment configuration exists within this plugin. By default the plugin assumes no environment is specified, however you can have different levels of environment config values which you can configure the plugin to look in first.

```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration', config => {
            config.setEnvironment('DEVELOPMENT'); // Environment changes to DEVELOPMENT
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
    "DEVELOPMENT": {
        "api": {
            "key": "developmentonlykey938109283091",
            "endpoint": "http://localhost/api/v1"
        },
    }
}
```

If you have specified a particular environment and a config value does not exist, it will look for it further up the config file. For example if you have your environment set to "DEVELOPMENT" and you request an API key but it isn't specified and you have a value specified futher up, it will use that. The idea is environment specific config values extend parent values, similar to what Ruby on Rails does with its configuration.

### Changing directory and/or filename
If you want to change the location of where your configuration files are loaded from or the name, you configure it during the bootstrapping phase within your ``main.js``.

```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration', config => {
            config.setDirectory('config-files'); // Will make plugin look for config files in a file called "config-files"
            config.setConfig('mycoolconfig.json'); // Will look for mycoolconfig.json as the configuration file
        });

    aurelia.start().then(a => a.setRoot());
}
```

## Dependencies

* [aurelia-dependency-injection](https://github.com/aurelia/dependency-injection)
* [aurelia-http-client](https://github.com/aurelia/http-client)
* [aurelia-event-aggregator](https://github.com/aurelia/event-aggregator)

## Building from src

To build this plugin from the source, follow these steps.

1. Ensure that you have [Node.js](http://nodejs.org) installed. This is what our tooling will depend on to compile the plugin.

2. Inside of the project folder, execute the following command:

```shell
npm install
```

3. Ensure that you have Gulp installed globally, using the following command:

```shell
npm install -g gulp
```

4. Ensure that you have JSPM installed globally, using the following command:

```shell
npm install -g jspm
```

5. To build the plugin, run:

```shell
gulp build
```

6. You will then find the compiled code in the 'dist' folder, in three different module formats: AMD, CommonJS and ES6.

## Running The Tests

To run the unit tests (there are none currently), please make sure you follow the above steps and then follow each step below to get the testing environment setup.

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If it is not installed, then install it using the following command:

  ```shell
  npm install -g karma-cli
  ```

2. Install the client-side dependencies with JSPM:

  ```shell
  jspm install
  ```
3. You can now run the tests with this command:

  ```shell
  karma start
  ```
