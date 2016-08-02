module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: [
      "src/**/*.ts",
      "test/**/*.ts"
    ],
    preprocessors: {
      'test/**/*.ts': ['typescript'],
      'src/**/*.ts': ['typescript']
    },
    typescriptPreprocessor: {
      options: {
        sourceMap: false,
        target: 'es5',
        module: 'amd',
        noImplicitAny: true,
        noResolve: true,
        removeComments: true,
        concatenateOutput: false 
      },
      transformPath: function(path) {
        return path.replace(/\.ts$/, '.js');
      }
    }
  });
};