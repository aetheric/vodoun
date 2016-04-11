/* global require */
'use strict';

import _ from 'underscore';

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

		console.log(`Initialised ${name}.`);

	};

	/**
	 * @param {String} name
	 * @returns {Promise<Object<String, Function>>}
	 */
	resolve(name) {
		return new Promise((resolve, reject) => {

			console.log(`Attempting to resolve service ${name}`);

			// If the service has been previously loaded, no need to do it again.
			const cached = this._cache[name];
			if (cached) {
				return resolve(cached);
			}

			// Try and find the service in the index.
			const entry = this._index[name];
			if (!entry) {
				return reject(new Error(`A service named ${name} is not in the index.`));
			}

			const context = {};

			/** @type {Object<String, String>} */
			const dependencies = entry.dependencies || {};
			const promises = _.map(dependencies, (name, alias) => {
				console.log(`=> Attempting to resolve dependency ${name}`);
				return this.resolve(name).then((resolved) => {
					context[alias] = resolved;
				});
			});

			Promise.all(promises).then((dependencies) => {

				console.log(`=> All ${dependencies.length} dependencies finished loading`);

				// Once all the dependencies are loaded, freeze the context.
				const frozenContext = Object.freeze(context);
				const service = {};

				console.log('=> About to initialise service with frozen context.');

				// Initialise the service with the frozen context.
				const result = entry.init.call(frozenContext, service);

				// if a promise is returned, this will be important, otherwise it'll just execute immediately.
				return Promise.resolve(result).then(() => {

					console.log('=> Successfully initialised service.');

					// Freeze the service and store it in the cache.
					const frozenService = Object.freeze(service);
					this._cache[name] = frozenService;

					console.log('Storing the resolved service in the cache.');

					// Return a frozen version of the service.
					return frozenService;

				});

			}).then(resolve, reject);

		});

	}

}
