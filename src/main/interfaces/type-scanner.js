/* global */
'use strict';

/**
 * @interface ScannerType
 */
export default class ScannerType {

	/**
	 * This should be invoked during server startup.
	 *
	 * @function
	 * @param {String} path
	 * @param {Map<String, Function|Object<String, Function|MatcherType>>} matchActions
	 * @return {Promise<Array<String>>}
	 */
	scan(path, matchActions) {
		throw new Error('Not implemented!');
	}

}
