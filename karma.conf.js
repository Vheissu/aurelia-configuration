module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jspm', 'jasmine'],
    jspm: {
      loadFiles: ['test/setup.js', 'test/unit/**/*.js'],
      serveFiles: ['src/**/*.js'],
      paths: {
        '*': '*',
        'github:*': 'jspm_packages/github/*',
        'npm:*': 'jspm_packages/npm/*'
      }
    },
    files: [],
    exclude: [],
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel']
    },
    'babelPreprocessor': {
      options: {
        sourceMap: 'inline',
        presets: [ 'es2015-loose', 'stage-1'],
        plugins: [
          'syntax-flow',
          'transform-decorators-legacy',
          'transform-flow-strip-types'
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
