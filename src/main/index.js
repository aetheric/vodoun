/* global console */
'use strict';

import _ from 'underscore';
import IndexType from './interfaces/type-index';
import './interfaces/type-service';

/**
 * @class Index
 * @implements IndexType
 */
export default class Index extends IndexType {

	/**
	 * @constructor
	 * @param {ServiceType} Service
	 */
	constructor(Service) {
		super();

		this.Service = Service;

		this._index = {};
		this._cache = {};

	}

	register(name, dependencies, init) {

		if (this._index[name]) {
			console.warn(`Overriding service ${name}...`);
		}

		this._index[name] = new this.Service(name, dependencies, init);

		console.log(`Registered ${name}.`);

	};

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
