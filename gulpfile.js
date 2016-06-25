/* global require */
'use strict';

const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const gulpMocha = require('gulp-mocha');
const gulpJsdoc = require('gulp-jsdoc3');
const gulpRollup = require('gulp-rollup');
const gulpIstanbul = require('gulp-istanbul');
const gulpCoveralls = require('gulp-coveralls');
const gulpSourcemaps = require('gulp-sourcemaps');
const rollupPluginTypescript = require('rollup-plugin-typescript');

const pkgInfo = require('./package.json');

gulp.task('build', () => {

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
				indent: false,
				plugins: [
					rollupPluginTypescript()
				]
			}))

			.pipe(gulpSourcemaps.write('.'))

			.pipe(gulp.dest('target/dist'));

});

gulp.task('test', (done) => gulp

		.src('src/main/**/*.js')

		// Covering files
		.pipe(gulpIstanbul())

		// Force `require` to return covered files
		.pipe(gulpIstanbul.hookRequire())

		.on('finish', () => gulp

				.src('src/test/**/*.spec.js')

				.pipe(gulpMocha({
					ui: 'bdd',
					reporter: 'spec',
					bail: false
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

				.once('end', (error) => {

					error && done(error);

					gulp.src('target/coverage/**/lcov.info')

							.pipe(gulpCoveralls())

							.once('end', function (error) {

								done(error);

							});

				})

		)

);

gulp.task('docs', (done) => {

	gulp

			.src([
				'README.adoc',
				'src/main/**/*.js'
			], {
				read: false
			})

			.pipe(gulpJsdoc({
				name: pkgInfo.name,
				description: pkgInfo.description,
				version: pkgInfo.version,
				licenses: pkgInfo.licenses,
				opts: {
					destination: 'target/docs'
				},
				plugins: [
					//'plugins/asciidoc'
				]
			}, done));

});

gulp.task('default', [
	'build',
	'test',
	'docs'
]);
