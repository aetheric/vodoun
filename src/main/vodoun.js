/* global console, require */
'use strict';

import VodounType from './interfaces/type-vodoun';
import './interfaces/type-scanner';
import './interfaces/type-index';

export default class Vodoun extends VodounType {

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
				const module = require(fileMatch);
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
