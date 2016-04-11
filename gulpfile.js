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
var istanbulTraceur = require('istanbul-traceur');


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

						// .on('error', gulpUtil.log)

						.once('end', function (error) {
							done(error);
						});

			});

});
