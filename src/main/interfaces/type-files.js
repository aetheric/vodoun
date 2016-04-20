/* global */
'use strict';

/**
 * @interface FilesType
 */
export default class FilesType {

	/**
	 * @function
	 * @param {String} path
	 * @returns {Promise<StatType>}
	 */
	stat(path) {
		throw new Error('Not implemented!');
	}

	/**
	 * @function
	 * @param {String} path
	 * @returns {Promise<Array<String>>}
	 */
	readdir(path) {
		throw new Error('Not implemented!');
	}

}
