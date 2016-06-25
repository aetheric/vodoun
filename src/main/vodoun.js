/* global console, require */
'use strict';

const proxyquire = require('proxyquire');

module.exports = class Vodoun {

	/**
	 * @constructor
	 * @param {IndexType} index
	 * @param {ScannerType} scanner
	 */
	constructor(index, scanner) {

		this._index = index;
		this._scanner = scanner;

	}

	/**
	 * @function
	 * @param {String} scanBase Where to start recursively scanning from.
	 * @param {String} [glob] The glob pattern to match against.
	 * @return {Promise}
	 */
	scan(scanBase, glob = '**/*.js') {

		if (!scanBase) {
			return Promise.reject(new Error('A scan base is required.'));
		}

		return this._scanner.scan(scanBase, {

			[glob]: (fileMatch) => {
				// services should add themselves to the index.
				const module = proxyquire(fileMatch, {
					vodoun: this
				});
			}

		});

	};

	/**
	 * @function
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {ServiceType.init} init
	 */
	register(name, dependencies, init) {

		if (this._index[name]) {
			throw new Error("Service called ${name} already added to index.")
		}

		this._index.register(name, dependencies, init);

	};

	/**
	 * @function
	 * @param {String} serviceName
	 * @return {Promise<Object<String, ?>>}
	 */
	resolve(serviceName) {

		if (!serviceName) {
			return Promise.reject(new Error('A service name is required.'));
		}

		return this._index.resolve(serviceName);

	}


};
