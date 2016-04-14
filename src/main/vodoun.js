/* global require */
'use strict';

import Index from './index'
import Service from './service'
import Scanner from './scanner'
import Files from './wrapper/files';
import Match from './wrapper/match';

export default class Vodoun {

	/**
	 * @param {Index} [indexType]
	 * @param {Service} [serviceType]
	 * @param {Scanner} [scannerType]
	 * @param {Match} [matchType]
	 * @param {Files} [filesType]
	 */
	constructor(indexType = Index, serviceType = Service, scannerType = Scanner, filesType = Files, matchType = Match) {

		// Save these classes for later use.
		this.Index = indexType;
		this.Service = serviceType;
		this.Scanner = scannerType;
		this.Match = matchType;
		this.Files = filesType;

	}

	/**
	 * @param {String} scanBase
	 * @param {String} [glob]
	 * @return {Promise}
	 */
	scan(scanBase, glob = '**/*.js') {

		if (!scanBase) {
			return Promise.reject(new Error('A scan base is required.'));
		}

		if (this._index) {
			return Promise.reject(new Error("An index has already been initialised."));
		}

		this._index = new this.Index();
		const scanner = new this.Scanner(this.Files, this.Match);

		return scanner.scan(scanBase, {

			[glob]: (fileMatch) => {
				// services should add themselves to the index.
				const module = require(fileMatch);
			}

		});

	};

	/**
	 * @callback register~init
	 * @this {Object} context
	 */
	/**
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {register~init} init
	 */
	register(name, dependencies, init) {

		if (!this._index) {
			throw new Error("Index has not been initialised yet.");
		}

		if (this._index[name]) {
			throw new Error("Service called ${name} already added to index.")
		}

		this._index.add(new this.Service(name, dependencies, init));

	};

	/**
	 * @param {String} serviceName
	 * @return {Promise<Object>}
	 */
	resolve(serviceName) {

		if (!serviceName) {
			return Promise.reject(new Error('A service name is required.'));
		}

		if (!this._index) {
			return Promise.reject(new Error("Index has not been initialised yet."));
		}

		return this._index.resolve(serviceName);

	}


};
