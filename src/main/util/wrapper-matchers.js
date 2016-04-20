/* global */
'use strict';

import minimatch from 'minimatch';

import MatchersType from '../interfaces/type-matchers';
import MatcherMatchersWrapper from './wrapper-matchers-matcher';

/**
 * @external Minimatch
 * @see minimatch#Minimatch
 */
const Minimatch = minimatch.Minimatch;

/**
 * @class MatchersWrapper
 * @implements MatchersType
 */
export default class MatchersWrapper extends MatchersType {

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
