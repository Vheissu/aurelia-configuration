import autoprefixer from 'gulp-autoprefixer';
import del from 'del';
import gulp from 'gulp';
import concat from 'gulp-concat';
import sass from 'gulp-sass';
import shell from 'gulp-shell';
import sourcemaps from 'gulp-sourcemaps';
import runSequence from 'run-sequence';

const assetPatterns = ["./src/**/*.html", "./*.css", "./src/**/*.json"];
const sassStyles = ["./styles/**/*.scss", "./src/**/*.scss"];
const typescriptPattern = "./src/**/*.ts";
const destination = "dist";

/**
 * Cleanup some directories and files
 * 
 */
gulp.task('cleanup', () => {
    return del([
        "dist/**"
    ]);
});

/**
 * Copy over standard files TypeScript doesn't touch such as;
 * json, css and html files
 * 
 */
gulp.task("copy-assets", () => {
    return gulp
        .src(assetPatterns)
        .pipe(gulp.dest(destination));
});

/**
 * Compiles Sass styles into CSS
 * which are put into the dist folder
 * 
 */
gulp.task("compile-sass", () => {
    return gulp
        .src(sassStyles)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(gulp.dest(destination))
        .resume();
});

/**
 * Watch for changes and act accordingly
 * 
 */
gulp.task("watch", () => {
    gulp.watch(typescriptPattern, ["tsc"]);
    gulp.watch(sassStyles, ["compile-sass"]);
    gulp.watch(assetPatterns, ["copy-assets"]);
});

/**
 * Copy the definition file from AMD to the dist
 * folder
 * 
 */
gulp.task("copy-definition-file", () => {
    return gulp
        .src(['dist/amd/*.d.ts'])
        .pipe(concat('index.d.ts'))
        .pipe(gulp.dest('dist'))

});

/**
 * Use command line TypeScript compiler to both compile
 * our TypeScript files and generate typing definition
 * 
 */
gulp.task('tsc', shell.task([
    "tsc --project tsconfig.json",
    "tsc --project tsconfig.es2015.json",
    "tsc --project tsconfig.system.json",
    "tsc --project tsconfig.amd.json"
]));

gulp.task('build', function(callback) {
    return runSequence(["tsc", "compile-sass", "copy-assets", "copy-definition-file"], callback);
});

gulp.task("default", ["build", "watch"]);
