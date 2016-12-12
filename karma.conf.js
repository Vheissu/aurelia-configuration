module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['jasmine', 'requirejs'],

    files: [
      'dist/test/test/main.js',
      { pattern: 'dist/test/**/*.js', included: false, watched: true },
      //{ pattern: 'dist/test/**/*.html', included: false, watched: true },
      { pattern: 'node_modules/**/*.js', included: false, watched: false },
    ],

    exclude: [
    ],

    preprocessors: {
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Chrome'],

    singleRun: false,

    concurrency: Infinity
  })
}
