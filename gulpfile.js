const gulp = require("gulp");
const babel = require("gulp-babel");
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');

const filesPath = {
  js: {
    src: path.resolve('./src/**/*.js'),
    dist: path.resolve('./dist'),
    debug_src: [path.resolve('./spec/**/*.js'), path.resolve('./src/**/*.js')],
    debug_dist: path.resolve('./debug')
  }
};

gulp.task('build:js', function() {
  return gulp.src(filesPath.js.src)
  .pipe(babel())
  .pipe(gulp.dest(filesPath.js.dist));
});

gulp.task('debug:js', function() {
  return gulp.src(filesPath.js.debug_src, { base: '.' })
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(filesPath.js.debug_dist));
});

gulp.task('watch', function() {
  gulp.watch(filesPath.js.src, gulp.series('build:js'));
});

gulp.task("default", gulp.series('build:js'));
