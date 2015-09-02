// Karma configuration
// Generated on Fri Dec 05 2014 16:49:29 GMT-0500 (EST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jspm', 'jasmine'],
    jspm: {
      loadFiles: ['src/**/*.js', 'test/**/*.js'],
      paths: {
          '*': '*.js'
      }
    },
    files: [],
    exclude: [
    ],
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel']
    },
    'babelPreprocessor': {
      options: {
        sourceMap: 'inline',
        modules: 'system',
        moduleIds: false,
        loose: "all",
        optional: [
          "es7.decorators",
          "es7.classProperties"
        ]
      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
