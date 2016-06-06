/* global require, module */
'use strict';

require('./type-matchers-matcher');

/**
 * @interface MatchersType
 */
module.exports = class MatchersType {

	/**
	 * @function
	 * @param {String} glob
	 * @returns {MatcherType}
	 */
	matcher(glob) {
		throw new Error('Not implemented!');
	}

};
