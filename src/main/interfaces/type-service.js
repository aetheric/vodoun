/* global */
'use strict';

/**
 * @interface ServiceType
 */
export default class ServiceType {

	/**
	 * @property
	 * @returns {String}
	 */
	get name() {
		throw new Error('Not implemented!');
	}

	/**
	 * @callback ServiceType.init
	 * @this {Object<String, ?>} context
	 * @returns {Promise|.}
	 */
	/**
	 * @property
	 * @returns {ServiceType.init}
	 */
	get init() {
		throw new Error('Not implemented!');
	}

	/**
	 * @property
	 * @returns {Object<String, String>}
	 */
	get dependencies() {
		throw new Error('Not implemented!');
	}

}
