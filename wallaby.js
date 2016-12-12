  module.exports = function (w) {
    return {
      files: [
        'src/**/*.ts'
      ],

      tests: [
        'test/unit/**/*.ts'
      ],

      compilers: {
        '**/*.ts': w.compilers.typeScript({
            typescript: require('typescript')
        })
      }
    };
  };
