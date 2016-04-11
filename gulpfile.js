/* global require */
'use strict';

var traceur = require('traceur');

require('traceur-source-maps').install(traceur);
traceur.require.makeDefault(function (filePath) {
	return !~filePath.indexOf('node_modules');
});

var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var gulpMocha = require('gulp-mocha');
var gulpIstanbul = require('gulp-istanbul');
var gulpCoveralls = require('gulp-coveralls');
var istanbulTraceur = require('istanbul-traceur');

gulp.task('build', function (done) {

	gulpUtil.log('This project doesn\'t need to be compiled');
	done();

});

gulp.task('test', function (done) {

	gulp.src('src/main/**/*.js')

			// Covering files
			.pipe(gulpIstanbul({
				instrumenter: istanbulTraceur.Instrumenter
			}))

			// Force `require` to return covered files
			.pipe(gulpIstanbul.hookRequire())

			.on('finish', function () {

				gulp.src('src/test/**/*.spec.js')

						.pipe(gulpMocha({
							ui: 'bdd',
							reporter: 'spec',
							bail: false,
							compilers: {
								js: 'mocha-traceur'
							}
						}))

						.pipe(gulpIstanbul.writeReports({
							dir: 'target/coverage',
							reporters: [
								'cobertura',
								'lcov'
							]
						}))

						.once('end', function (error) {

							error && done(error);

							gulp.src('target/coverage/**/lcov.info')

									.pipe(gulpCoveralls())

									.once('end', function (error) {

										done(error);

									});

						});

			});

});

gulp.task('docs', function (done) {

	gulpUtil.log('This project doesn\'t have any docs to compile yet.');
	done();

});

gulp.task('default', [
	'build',
	'test',
	'docs'
]);
