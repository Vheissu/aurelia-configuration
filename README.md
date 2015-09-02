# Aurelia-Configuration
A smart configuration plugin and singleton service layer for your Aurelia applications.

## Get Started

1. Install aurelia-configuration

```bash
jspm install aurelia-configuration=github:vheissu/aurelia-configuration
```
2. USe the plugin in your app's main.js:
```javascript
export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin('aurelia-configuration');

    aurelia.start().then(a => a.setRoot());
}
```
## Dependencies

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
