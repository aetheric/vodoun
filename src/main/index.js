/* global require */
'use strict';

import Service from './service'

export default class Index {

	constructor() {
		this._index = {};
		this._cache = {};
	}

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

		if (this._index[name]) {
			throw new Error(`Service called ${name} already added to index.`)
		}

		this._index[name] = new Service(name, dependencies, init);

	};

	/**
	 * @param {String} name
	 * @returns {Promise<Object<String, Function>>}
	 */
	resolve(name) {
		return new Promise((resolve, reject) => {

			// If the service has been previously loaded, no need to do it again.
			const cached = this._cache[name];
			if (cached) {
				return Promise.resolve(cached);
			}

			// Try and find the service in the index.
			const entry = this._index[name];
			if (!entry) {
				return reject(new Error(`A service named ${name} is not in the index.`));
			}

			const context = {};

			/** @type {Object<String, String>} */
			const dependencies = entry.dependencies || [];
			const promises = dependencies.map((alias, name) => {
				this.resolve(name).then((resolved) => {
					context[alias] = resolved;
				});
			});

			return Promise.all(promises).then(() => {

				// Once all the dependencies are loaded, freeze the context.
				const frozenContext = Object.freeze(context);
				const service = {};

				// Initialise the service with the frozen context.
				const result = entry.init.call(frozenContext, service);

				// if a promise is returned, this will be important, otherwise it'll just execute immediately.
				return Promise.resolve(result).then(() => {

					// Freeze the service and store it in the cache.
					const frozenService = Object.freeze(service);
					this._cache[name] = frozenService;

					// Return a frozen version of the service.
					return frozenService;

				});

			});

		});

	}

}
