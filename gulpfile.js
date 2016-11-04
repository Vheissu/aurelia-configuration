"use strict";

const assign = Object.assign;
const babel = require('gulp-babel');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const Karma = require('karma').Server;
const runSequence = require('run-sequence');
const path = require('path');
const vinylPaths = require('vinyl-paths');

const src = 'src/';
const dist = 'dist/';

var paths = {
    root: src,
    source: src + '**/*.js',
    html: src + '**/*.html',
    css: src + '**/*.css',
    style: 'styles/**/*.css',
    output: dist,
    e2eSpecsSrc: 'test/e2e/src/*.js',
    e2eSpecsDist: 'test/e2e/dist/'
};

const babelOptions = {
    base: function() {
        return {
            filename: '',
            filenameRelative: '',
            sourceMap: true,
            sourceRoot: '',
            moduleRoot: path.resolve('src').replace(/\\/g, '/'),
            moduleIds: false,
            comments: false,
            compact: false,
            code:true,
            presets: [ 'es2015-loose', 'stage-1'],
            plugins: [
                'syntax-flow',
                'transform-decorators-legacy',
                'transform-flow-strip-types'
            ]
        };
    },
    commonjs: function() {
        var options = babelOptions.base();
        options.plugins.push('transform-es2015-modules-commonjs');
        return options;
    },
    amd: function() {
        var options = babelOptions.base();
        options.plugins.push('transform-es2015-modules-amd');
        return options;
    },
    system: function() {
        var options = babelOptions.base();
        options.plugins.push('transform-es2015-modules-systemjs');
        return options;
    },
    es2015: function() {
        var options = babelOptions.base();
        options.presets = ['stage-1']
        return options;
    }
};

gulp.task('clean', function() {
    return gulp.src([paths.output])
        .pipe(vinylPaths(del));
});

gulp.task('test', function(done) {
    new Karma({
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('tdd', function(done) {
    new Karma({
        configFile: __dirname + '/../../karma.conf.js'
    }, done).start();
});

gulp.task('cover', function(done) {
    new Karma({
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: true,
        reporters: ['coverage'],
        preprocessors: {
            'test/**/*.js': ['babel'],
            'src/**/*.js': ['babel', 'coverage']
        },
        coverageReporter: {
            includeAllSources: true,
            instrumenters: {
                isparta: require('isparta')
            },
            instrumenter: {
                'src/**/*.js': 'isparta'
            },
            reporters: [
                { type: 'html', dir: 'coverage' },
                { type: 'text' }
            ]
        }
    }, done).start();
});

gulp.task('lint', function() {
    return gulp.src(paths.source)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('build-html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.output + 'es2015'))
        .pipe(gulp.dest(paths.output + 'commonjs'))
        .pipe(gulp.dest(paths.output + 'amd'))
        .pipe(gulp.dest(paths.output + 'system'))
});

gulp.task('build-css', function() {
    return gulp.src(paths.css)
        .pipe(gulp.dest(paths.output + 'es2015'))
        .pipe(gulp.dest(paths.output + 'commonjs'))
        .pipe(gulp.dest(paths.output + 'amd'))
        .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-es2015', function() {
    return gulp.src(paths.source)
        .pipe(babel(assign({}, babelOptions.es2015())))
        .pipe(gulp.dest(paths.output + 'es2015'));
});

gulp.task('build-commonjs', function() {
    return gulp.src(paths.source)
        .pipe(babel(assign({}, babelOptions.commonjs())))
        .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', function() {
    return gulp.src(paths.source)
        .pipe(babel(assign({}, babelOptions.amd())))
        .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', function() {
    return gulp.src(paths.source)
        .pipe(babel(assign({}, babelOptions.system())))
        .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build', function(callback) {
    return runSequence(
        'clean',
        ['build-html', 'build-css', 'build-es2015', 'build-commonjs', 'build-amd', 'build-system'],
        callback
    );
});
