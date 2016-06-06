/* global require, module */
'use strict';

const MatcherType = require('../interfaces/type-matchers-matcher');

/**
 * @external Minimatch
 * @see minimatch#Minimatch
 */

/**
 * @class MatchersMatcherWrapper
 * @implements MatcherType
 */
module.exports = class MatchersMatcherWrapper extends MatcherType {

	/**
	 * @constructor
	 * @param {Minimatch} matcher An instantiated Minimatch object.
	 */
	constructor(matcher) {
		super();

		this.matcher = matcher;

	}

	/** @inheritDoc */
	matches(path) {
		return this.matcher.match(path);
	}

}
