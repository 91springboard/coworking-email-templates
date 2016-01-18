/**
 * Created by Vibhanshu Chaturvedi on 18/1/16.
 */

'use strict';

var gulp = require('gulp'),
	inlineCss = require('gulp-inline-css'),
	sass = require('gulp-sass'),
	gulpSequence = require('gulp-sequence').use(gulp),
	del = require('del'),
	fs = require('fs'),
	wrap = require('gulp-wrap'),
	htmlmin = require('gulp-htmlmin');


gulp.task('sass', function () {
	gulp.src('./app/sass/**/*.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest('./app/styles'));
});


gulp.task('inline-css', function () {
	return gulp.src(['./app/*.html'])
		.pipe(inlineCss())
		.pipe(gulp.dest('build/'));
});


gulp.task('layout', function () {
	return gulp.src(['./app/pages/*.html', '!app/templates/layout.html'])
		.pipe(wrap({src: './app/templates/layout.html'}))
		.pipe(gulp.dest('./app'));
});


gulp.task('clean', function () {
	// Return the Promise from del()
	return del(['./build', './app/styles', './app/*.html']);
});


gulp.task('minify', function () {
	return gulp.src('./build/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./build'))
});

gulp.task('build', gulpSequence('clean', 'sass', 'layout', 'inline-css', 'minify'));


