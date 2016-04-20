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
	 * @param {Object<String|MatchersType, Function>} matchActions
	 * @return {Promise<Array<String>>}
	 */
	scan(path, matchActions) {
		throw new Error('Not implemented!');
	}

}
