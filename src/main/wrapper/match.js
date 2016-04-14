/* global */

import Minimatch from 'minimatch';

export default class Match {

	/**
	 * @param {Minimatch} [matchType]
	 */
	constructor(matchType = Minimatch) {
		this.Match = matchType;
	}

	/**
	 * @param {String} pattern
	 */
	matcher(pattern) {
		return {
			match: (input) => {
				return this.Match(pattern).match(input);
			}
		}
	}

}
