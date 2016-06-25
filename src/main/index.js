/* global console */
'use strict';

const _ = require('underscore');

/**
 * @class Index
 * @implements IndexType
 */
module.exports = class Index {

	/**
	 * @constructor
	 * @param {ServiceType} Service
	 */
	constructor(Service) {

		this.Service = Service;

		this._index = {};
		this._cache = {};

	}

	/**
	 * @function
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {Service#init} init
	 * @return {Service}
	 */
	register(name, dependencies, init) {

		if (this._index[name]) {
			console.warn(`Overriding service ${name}...`);
		}

		const service = new this.Service(name, dependencies, init);
		this._index[name] = service;

		console.log(`Registered ${name}.`);

		return service;

	};

	/**
	 * @function
	 * @param {String} name The registered name of the service to resolve.
	 * @param {Array<String>} [history] Used to detect cyclical dependencies during recursion.
	 * @returns {Promise<Object<String, ?>>}
	 */
	resolve(name, history = []) {
		return new Promise((resolve, reject) => {

			console.log(`Attempting to resolve service ${name}`);

			if (_.contains(history, name)) {
				return reject(new Error(`No cyclical dependencies! Attempted ${JSON.stringify(history)} + ${name}`));
			}

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
			const promises = _.map(dependencies, (alias, serviceId) => {
				console.log(`=> Attempting to resolve dependency ${serviceId}`);
				return this.resolve(serviceId, _.union(history, [ name ])).then((resolved) => {
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
				const result = entry.init.call(frozenContext, service, frozenContext);

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

};
