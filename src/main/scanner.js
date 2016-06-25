/* global console */
'use strict';

const _ = require('underscore');

/**
 * @external PathLib
 * @see path
 */
/**
 * @type PathLib
 */
const paths = require('path');

/**
 * @template Key, Value, NewKey, Context
 * @callback mapObjectKeys~mapper<Key, Value, NewKey, Context>
 * @this {Context}
 * @param {Key} key
 * @param {Value} value
 * @param {Context} [context]
 * @return {NewKey}
 */
/**
 * @template Key, Value, NewKey, Context
 * @param {Object<Key, Value>} object
 * @param {mapObjectKeys~mapper<Key, Value, NewKey, Context>} mapper
 * @param {Context} [context]
 * @returns {Map<NewKey, Value>}
 */
function mapObjectKeys(object, mapper, context = {}) {
	return _.reduce(object, (map, value, key) => {

		// Generate the new key by invoking the mapper function.
		const newKey = mapper.call(context, key, value, context);
		map[newKey] = value;
		return map;

	}, new Map());
}

/**
 * @callback OnMatchCallback
 * @param {String} path
 */
/**
 * @callback MatchReducerCallback
 * @param {Boolean} hasMatch
 * @param {Object<String, OnMatchCallback|MatcherType>} matchAction
 * @param {String} globString
 * @returns {Array<String>}
 */
/**
 * @param {String} path
 * @returns {MatchReducerCallback}
 * @constructor
 */
function MatchReducer(path) {
	return (hasMatch, matchAction, globString) => {

		const matches = matchAction.matcher.matches(path);
		matchAction.action.call(undefined, path);

		return hasMatch || matches;

	};
}

/**
 * @class Scanner
 * @implements ScannerType
 */
module.exports = class Scanner {

	/**
	 * @constructor
	 * @param {FilesType} files
	 * @param {MatchersType} matcher
	 */
	constructor(files, matcher) {

		this._files = files;
		this._matcher = matcher;

	}

	/**
	 * This should be invoked during server startup.
	 *
	 * @function
	 * @param {String} path
	 * @param {Map<String, Function|Object<String, Function|MatcherType>>} matchActions
	 * @return {Promise<Array<String>>}
	 */
	scan(path, matchActions) {

		if (!path) {
			return Promise.reject(new Error('A base search path is required.'));
		}

		if (!matchActions) {
			return Promise.reject(new Error('Scanning is pointless without match actions.'));
		}

		// Get the first stored key.
		const firstAction = _.chain(matchActions).values().first().value();

		if (firstAction && _.isFunction(firstAction)) {
			return this.scan(path, _.mapObject(matchActions, (matchAction, globString) => {
				return {
					action: matchAction,
					matcher: this._matcher.matcher(globString)
				};
			}));
		}

		return this._files.stat(path).then((stats) => {

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
			return this._files.readdir(path).then((files) => {

				const results = _.map(files, (file) => {
					const subPath = paths.resolve(path, file);
					return this.scan(subPath, matchActions);
				});

				return Promise.all(results)
						.then(_.flatten);

			});

		});

	}

};
