module.exports = function () {

  return {
    files: [
      {pattern: 'node_modules/requirejs/require.js', instrument: false},
      {pattern: 'node_modules/babel-polyfill/browser.js', instrument: false},
      {pattern: 'src/**/*.ts', load: false},
      {pattern: 'test/unit/setup.ts', load: false}
    ],

    tests: [
      {pattern: 'test/unit/**/*.spec.ts', load: false}
    ],

    env: {
      type: 'browser'
    },

    middleware: function (app, express) {
      app.use('/node_modules',
        express.static(require('path').join(__dirname, 'node_modules')));
    },

    setup: function (wallaby) {
      wallaby.delayStart();

      requirejs.config({
        paths: {
          'aurelia-binding': '/node_modules/aurelia-binding/dist/amd/aurelia-binding',
          'aurelia-bootstrapper': '/node_modules/aurelia-bootstrapper/dist/amd/aurelia-bootstrapper',
          'aurelia-dependency-injection': '/node_modules/aurelia-dependency-injection/dist/amd/aurelia-dependency-injection',
          'aurelia-framework': '/node_modules/aurelia-framework/dist/amd/aurelia-framework',
          'aurelia-loader': '/node_modules/aurelia-loader/dist/amd/aurelia-loader',
          'aurelia-logging': '/node_modules/aurelia-logging/dist/amd/aurelia-logging',
          'aurelia-metadata': '/node_modules/aurelia-metadata/dist/amd/aurelia-metadata',
          'aurelia-pal': '/node_modules/aurelia-pal/dist/amd/aurelia-pal',
          'aurelia-pal-browser': '/node_modules/aurelia-pal-browser/dist/amd/aurelia-pal-browser',
          'aurelia-polyfills': '/node_modules/aurelia-polyfills/dist/amd/index',
          'aurelia-path': '/node_modules/aurelia-path/dist/amd/aurelia-path',
          'aurelia-task-queue': '/node_modules/aurelia-task-queue/dist/amd/aurelia-task-queue',
          'aurelia-templating': '/node_modules/aurelia-templating/dist/amd/aurelia-templating',
          'aurelia-testing': '/node_modules/aurelia-testing/dist/amd/aurelia-testing',
          'deep-extend': '/node_modules/deep-extend/index',
        }
      });

      require(['/test/unit/setup.js'].concat(wallaby.tests), function () {
        wallaby.start();
      });
    }
  };
};
