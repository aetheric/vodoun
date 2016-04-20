/* global */
'use strict';

/**
 * @interface StatType
 */
export default class StatType {

	/**
	 * @function
	 * @returns {Boolean}
	 */
	isFile() {
		throw new Error('Not implemented!');
	}

	/**
	 * @function
	 * @returns {Boolean}
	 */
	isDirectory() {
		throw new Error('Not implemented!');
	}

}
