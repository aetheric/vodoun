/* global */
'use strict';

import _ from 'underscore';
import paths from 'path';

import Files from './wrapper/files';
import Match from './wrapper/match';

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

/**
 * @callback OnMatchCallback
 * @param {String} path
 */
/**
 * @callback MatchReducerCallback
 * @param {Boolean} hasMatch
 * @param {OnMatchCallback} onMatch
 * @param {Minimatch} glob
 * @returns {Array<String>}
 */
/**
 * @param {String} path
 * @returns {MatchReducerCallback}
 * @constructor
 */
function MatchReducer(path) {
	return (hasMatch, onMatch, glob) => {

		const matches = glob.match(path);
		onMatch.call(undefined, path);

		return hasMatch || matches;

	};
}

export default class Scanner {

	/**
	 * @param {Files} filesType
	 * @param {Match} matchType
	 */
	constructor(filesType, matchType = Match) {

		this.Files = filesType;
		this.Match = matchType;

	}

	/**
	 * This should be invoked during server startup.
	 * @param {String} path
	 * @param {Object<String|Match, Function>} matchActions
	 * @return {Promise<Array<String>>}
	 */
	scan(path, matchActions) {

		throw new Error();

		if (!path) {
			return Promise.reject(new Error('A base search path is required.'));
		}

		if (!matchActions) {
			return Promise.reject(new Error('Scanning is pointless without match actions.'));
		}

		// Get the first stored key.
		const firstAction = _.chain(matchActions)
				.keys()
				.first()
				.value();

		if (firstAction && _.isString(firstAction)) {
			const globTransform = (globString) => new this.Match(globString);
			const newActions = mapObjectKeys(matchActions, globTransform, {});
			return this.scan(path, newActions);
		}

		return this.Files.stat(path).then((stats) => {

			// add them to the index, but don't load them.
			if (stats.isFile()) {

				console.warn(`File encountered while stat-ing ${path}`);
				const hasMatch = _.reduce(matchActions, new MatchReducer(path), false);

				// if the file has at least one glob match, add it to the result.
				return hasMatch
						? [ path ]
						: [];

			}

			// if its not a directory, we don't care.
			if (!stats.isDirectory()) {
				console.warn(`??? encountered while stat-ing ${path}`);
				return [];
			}

			// recursively scan a directory for files.
			console.warn(`Directory encountered while stat-ing ${path}`);
			return this.Files.readdir(path).then((files) => {

				const results = _.map(files, (file) => {
					const subPath = paths.resolve(path, file);
					return this.scan(subPath, matchActions);
				});

				return Promise.all(results)
						.then(_.flatten);

			});

		});

	}

}
