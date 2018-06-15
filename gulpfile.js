const gulp = require("gulp");
const babel = require("gulp-babel");
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');

const filesPath = {
  js: {
    src: path.resolve('./src/**/*.js'),
    dist: path.resolve('./dist')
  }
};

gulp.task('build:js', function() {
  return gulp.src(filesPath.js.src)
  .pipe(babel())
  .pipe(gulp.dest(filesPath.js.dist));
});

gulp.task('watch', function() {
  gulp.watch(filesPath.js.src, gulp.series('build:js'));
});

gulp.task("default", gulp.series('build:js'));
