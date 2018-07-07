const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const eslint = require('gulp-eslint');

const filesPath = {
  js: {
    src: path.resolve('./src/**/*.js'),
    dist: path.resolve('./dist'),
  },
};

gulp.task('lint:js', () =>
  gulp.src(filesPath.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('build:js', () =>
  gulp.src(filesPath.js.src)
    .pipe(babel())
    .pipe(gulp.dest(filesPath.js.dist)));

gulp.task('watch', () => {
  gulp.watch(filesPath.js.src, gulp.series('build:js'));
});

gulp.task('dist:js', gulp.series('lint:js', 'build:js'));
gulp.task('dist', gulp.parallel('dist:js'));

gulp.task('default', gulp.series('dist'));
