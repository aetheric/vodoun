/* global */
'use strict';

import './type-service';

/**
 * @interface VodounType
 */
export default class VodounType {

	/**
	 * @function
	 * @param {String} scanBase Where to start recursively scanning from.
	 * @param {String} [glob] The glob pattern to match against.
	 * @return {Promise}
	 */
	scan(scanBase, glob) {
		throw new Error('Not implemented!');
	}

	/**
	 * @function
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {ServiceType.init} init
	 */
	register(name, dependencies, init) {
		throw new Error('Not implemented!');
	}

	/**
	 * @function
	 * @param {String} serviceName
	 * @return {Promise<Object<String, ?>>}
	 */
	resolve(serviceName) {
		throw new Error('Not implemented!');
	}

}
