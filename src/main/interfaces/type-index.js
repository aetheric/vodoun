/* global require, module */
'use strict';

require('./type-service');

/**
 * @interface IndexType
 */
module.exports = class IndexType {

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
	 * @param {String} name The registered name of the service to resolve.
	 * @param {Array<String>} [history] Used to detect cyclical dependencies during recursion.
	 * @returns {Promise<Object<String, ?>>}
	 */
	resolve(name, history) {
		throw new Error('Not implemented!');
	}

}
