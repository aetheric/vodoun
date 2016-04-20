/* global */
'use strict';

import './type-matchers-matcher';

/**
 * @interface MatchersType
 */
export default class MatchersType {

	/**
	 * @function
	 * @param {String} glob
	 * @returns {MatcherType}
	 */
	matcher(glob) {
		throw new Error('Not implemented!');
	}

};
