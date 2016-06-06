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
var gulpJsdoc = require('gulp-jsdoc');
var gulpRollup = require('gulp-rollup');
var gulpIstanbul = require('gulp-istanbul');
var gulpCoveralls = require('gulp-coveralls');
var gulpSourcemaps = require('gulp-sourcemaps');
var istanbulTraceur = require('istanbul-traceur');

var pkgInfo = require('./package.json');

gulp.task('build', function () {

	return gulp

			.src([
				'index.js',
				'src/main/**/*.js'
			], {
				read: false
			})

			.pipe(gulpRollup({
				sourceMap: true,
				entry: 'index.js',
				indent: false
			}))

			.pipe(gulpSourcemaps.write('.'))

			.pipe(gulp.dest('target/dist'));

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

						.on('error', function (error) {
							gulpUtil.log(error);
						})

						.pipe(gulp.dest('target/testing'))

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

gulp.task('docs', function () {

	return gulp

			.src([
				'README.adoc',
				'src/main/**/*.js'
			])

			.pipe(gulpJsdoc.parser({
				name: pkgInfo.name,
				description: pkgInfo.description,
				version: pkgInfo.version,
				licenses: pkgInfo.licenses,
				plugins: [
					//'plugins/asciidoc'
				]
			}))

			.pipe(gulpJsdoc.generator('target/docs'));
});

gulp.task('default', [
	'build',
	'test',
	'docs'
]);
