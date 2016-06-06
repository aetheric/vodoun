/* global require, module */
'use strict';

/**
 * @interface StatType
 */
module.exports = class StatType {

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
