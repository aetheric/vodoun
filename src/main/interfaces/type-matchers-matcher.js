/* global require, module */
'use strict';

/**
 * @interface MatcherType
 */
module.exports = class MatcherType {

	/**
	 * @function
	 * @param {String} path The path to perform a glob match against.
	 * @returns {Boolean} Will return true if there is a match, and false if not.
	 */
	matches(path) {
		throw new Error('Not implemented!');
	}

}
