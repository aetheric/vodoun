/* global */
'use strict';

import './type-service';

/**
 * @interface IndexType
 */
export default class IndexType {

	/**
	 * @function
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {ServiceType#init} init
	 */
	register(name, dependencies, init) {
		throw new Error('Not implemented!');
	}

	/**
	 * @function
	 * @param {String} name
	 * @returns {Promise<Object<String, ?>>}
	 */
	resolve(name) {
		throw new Error('Not implemented!');
	}

}
