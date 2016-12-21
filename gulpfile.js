(function () {
  'use strict';

  let gulp = require('gulp');
  let inlineCss = require('gulp-inline-css');
  let sass = require('gulp-sass');
  let gulpSequence = require('gulp-sequence').use(gulp);
  let del = require('del');
  let wrap = require('gulp-wrap');
  let htmlmin = require('gulp-htmlmin');
  let argv = require('yargs').argv;
  let base = './' + argv.base + '/';
  let browserSync = require('browser-sync').create();

  gulp.task('serve', ['sass', 'layout'], function () {

    browserSync.init({
      server: {
        baseDir: './.tmp'
      }
    });

    gulp.watch(base + 'sass/*.scss', ['sass']);
    gulp.watch(base + '**/*.html', ['layout-watch']);
  });

  gulp.task('sass', function () {
    gulp.src(base + 'sass/**/*.scss')
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(gulp.dest('./.tmp/styles'))
      .pipe(browserSync.stream());
  });

  gulp.task('inline-css', function () {
    return gulp.src(['./.tmp/*.html'])
      .pipe(inlineCss())
      .pipe(gulp.dest('build/'));
  });

  gulp.task('layout-watch', ['layout'], function (done) {
    browserSync.reload();
    done();
  });

  gulp.task('layout', function () {
    return gulp.src([base + 'pages/*.html'])
      .pipe(wrap({src: base + 'layout.html'}))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./.tmp'));
  });

  gulp.task('clean', function () {
    return del(['./build', './.tmp', base + './app/styles']);
  });

  gulp.task('build', gulpSequence('clean', 'sass', 'layout', 'inline-css'));

}());
