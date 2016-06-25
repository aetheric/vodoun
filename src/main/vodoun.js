/* global console, require */
'use strict';

const proxyquire = require('proxyquire');

module.exports = class Vodoun {

	/**
	 * @constructor
	 * @param {Index} index
	 * @param {Scanner} scanner
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
	 * @param {Service#init} init
	 * @return {Service}
	 */
	register(name, dependencies = [], init) {

		if (!name) {
			throw new Error('A service name is required.');
		}

		if (!init) {
			throw new Error('A service must have a constructor.');
		}

		return this._index.register(name, dependencies, init);

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
