/* global module */
'use strict';

/**
 * @class
 * @extends Promise<T>
 */
module.exports = class DeferredPromise {

	/**
	 * @constructor
	 */
	constructor() {
		this._promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}

	/**
	 * @see Promise#resolve
	 * @param value
	 * @returns {Promise<T>}
	 */
	resolve(value) {
		this._resolve(value);
		return this._promise;
	}

	/**
	 * @see Promise#reject
	 * @param error
	 * @returns {Promise<T>}
	 */
	reject(error) {
		this._reject(error);
		return this._promise;
	}

	/**
	 * @see Promise#then
	 * @param callback
	 * @returns {Promise<T>}
	 */
	then(callback) {
		return this._promise.then(callback);
	}

	/**
	 * @see Promise#catch
	 * @param callback
	 * @returns {Promise<T>}
	 */
	'catch'(callback) {
		return this._promise.catch(callback);
	}

};
