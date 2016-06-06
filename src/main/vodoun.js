/* global console, require */
'use strict';

const proxyquire = require('proxyquire');

const VodounType = require('./interfaces/type-vodoun');
require('./interfaces/type-scanner');
require('./interfaces/type-index');

module.exports = class Vodoun extends VodounType {

	/**
	 * @constructor
	 * @param {IndexType} index
	 * @param {ScannerType} scanner
	 */
	constructor(index, scanner) {
		super();

		this._index = index;
		this._scanner = scanner;

	}

	/** @inheritDoc */
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

	/** @inheritDoc */
	register(name, dependencies, init) {

		if (this._index[name]) {
			throw new Error("Service called ${name} already added to index.")
		}

		this._index.register(name, dependencies, init);

	};

	/** @inheritDoc */
	resolve(serviceName) {

		if (!serviceName) {
			return Promise.reject(new Error('A service name is required.'));
		}

		return this._index.resolve(serviceName);

	}


};
