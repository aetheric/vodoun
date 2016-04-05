/* global */
'use strict';

import _ from 'underscore';
import minimatch from 'minimatch';
import files from 'fs';
import paths from 'path';

const Minimatch = minimatch.Minimatch;

/**
 * This should be invoked during server startup.
 * @param {String} path
 * @param {Object<String, Function>} matchActions
 * @return {Promise<Array<String>>}
 */
export default function scan(path, matchActions) {
	return _scan(path, mapObjectKeys(matchActions, globString => new Minimatch(globString), {}));
}

/**
 * This should be invoked during server startup.
 * @param {String} path
 * @param {Object<Minimatch, Function>} matchActions
 * @return {Promise<Array<String>>}
 */
function _scan(path, matchActions) {
	return new Promise((resolve, reject) => {

		fs.stat(path, (error, stats) => {

			if (error) {
				return reject(error);
			}

			// add them to the index, but don't load them.
			if (stats.isFile()) {

				const hasMatch = _.reduce(matchActions, (hasMatch, onMatch, glob) => {
					const matches = glob.match(path);
					onMatch.call(undefined, path);

					return hasMatch || matches;

				}, false);

				// if the file has at least one glob match, add it to the result.
				return resolve(hasMatch
						? [path]
						: []);

			}

			// if its not a directory, we don't care.
			if (!stats.isDirectory()) {
				return;
			}

			// recursively scan a directory for files.
			files.readdir(path, (error, files) => {

				if (error) {
					return reject(error);
				}

				const results = _.transform(files, (file) => {
					const subPath = paths.resolve(path, file);
					return scan(subPath, matchActions);
				});

				return Promise.all(results).then((resolved) => {
					const flattened = _.flatten(resolved);
					return resolve(flattened);
				});

			});

		});

	});
}

/**
 * @template Key, Value, NewKey
 * @callback mapObjectKeys~mapper<Key, Value, NewKey>
 * @param {Key} key
 * @param {Value} value
 * @return {NewKey}
 */
/**
 * @template Key, Value, NewKey
 * @param {Object<Key, Value>} object
 * @param {mapObjectKeys~mapper<Key, Value, NewKey>} mapper
 * @param {Object} [context]
 * @returns {Object<NewKey, Value>}
 */
function mapObjectKeys(object, mapper, context) {
	return _.chain(object) // start the chain.
			.invert() // swap keys and values.
			.mapObject(mapper, context) // do the transform
			.invert() // swap things back
			.value(); // extract the result from the chain.
}
