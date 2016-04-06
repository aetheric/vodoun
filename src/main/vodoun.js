/* global require */
'use strict';

import Index from './index'
import Service from './service'
import Resolver from './resolver'
import scanner from './scanner'

export default class Vodoun {

	/**
	 * @param {Index} Index
	 * @param {Service} Service
	 * @param {Resolver} Resolver
	 * @param scanner
	 */
	constructor(Index, Service, Resolver, scanner) {

		// Save these classes for later use.
		this.Index = Index;
		this.Service = Service;
		this.Resolver = Resolver;

		// Initialise the local necessities.
		this._scanner = scanner;

	}

	/**
	 * @param {String} scanBase
	 * @param {String} glob
	 */
	scan(scanBase, glob) {

		if (this._index) {
			throw new Error("An index has already been initialised.");
		}

		this._index = new Index();
		this._resolver = new Resolver(this._index);

		scanner(scanBase, {

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

		this._index.add(new Service(name, dependencies, init));

	};

	/**
	 * @param {String} serviceName
	 */
	resolve(serviceName) {

		if (!this._index) {
			throw new Error("Index has not been initialised yet.");
		}

		const service = this._index.get(serviceName);

		if (!service) {
			throw new Error("Service has not been added to the index.")
		}

		return this._resolver.resolve(service);

	}


};
