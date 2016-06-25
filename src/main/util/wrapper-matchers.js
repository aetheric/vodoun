/* global require, module */
'use strict';

/**
 * @external MinimatchLib
 * @see minimatch
 */
/**
 * @type {MinimatchLib}
 */
const minimatch = require('minimatch');

const MatcherMatchersWrapper = require('./wrapper-matchers-matcher');

/**
 * @type {MinimatchLib#Minimatch}
 */
const Minimatch = minimatch.Minimatch;

/**
 * @class MatchersWrapper
 * @implements MatchersType
 */
module.exports = class MatchersWrapper {

	/**
	 * @constructor
	 */
	constructor() {
	}

	/**
	 * @function
	 * @param {String} pattern
	 * @returns {MatcherType}
	 */
	matcher(pattern) {
		const matcher = new Minimatch(pattern);
		return new MatcherMatchersWrapper(matcher);
	}

};
