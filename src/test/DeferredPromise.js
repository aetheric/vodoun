/* global */
'use strict';

/**
 * @class
 * @extends Promise
 */
export default class DeferredPromise {

	constructor() {
		this._promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}

	resolve(value) {
		this._resolve(value);
		return this._promise;
	}

	reject(error) {
		this._reject(error);
		return this._promise;
	}

	then(callback) {
		return this._promise.then(callback);
	}

	catch(callback) {
		return this._promise.catch(callback);
	}

}
