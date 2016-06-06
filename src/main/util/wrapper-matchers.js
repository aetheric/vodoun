/* global require, module */
'use strict';

const minimatch = require('minimatch');

const MatchersType = require('../interfaces/type-matchers');
const MatcherMatchersWrapper = require('./wrapper-matchers-matcher');

/**
 * @external Minimatch
 * @see minimatch#Minimatch
 */
const Minimatch = minimatch.Minimatch;

/**
 * @class MatchersWrapper
 * @implements MatchersType
 */
module.exports = class MatchersWrapper extends MatchersType {

	/**
	 * @constructor
	 */
	constructor() {
		super();
	}

	/** @inheritDoc */
	matcher(pattern) {
		const matcher = new Minimatch(pattern);
		return new MatcherMatchersWrapper(matcher);
	}

}
