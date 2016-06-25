/* global require, module */
'use strict';

/**
 * @external Minimatch
 * @see minimatch#Minimatch
 */

/**
 * @class MatchersMatcherWrapper
 * @implements MatcherType
 */
module.exports = class MatchersMatcherWrapper {

	/**
	 * @constructor
	 * @param {Minimatch} matcher An instantiated Minimatch object.
	 */
	constructor(matcher) {

		this.matcher = matcher;

	}

	/**
	 * @function
	 * @param {String} path The path to perform a glob match against.
	 * @returns {Boolean} Will return true if there is a match, and false if not.
	 */
	matches(path) {
		return this.matcher.match(path);
	}

};
