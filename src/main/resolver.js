/* global */
'use strict';

import Index from './index';

export default class Resolver {

	/**
	 * @param {Index} index
	 */
	constructor(index) {
		this._index = index;
	}

	/**
	 * Lazily injects promises for the files into code. //TODO: Fuckity fuck-fuck. Remove lazy-loading. Need custom names.
	 * @param {Array<String>|Object<String, String>} names
	 * @param {Function} callback
	 * @param {...*} [args]
	 */
	inject(names, callback, ...args) {

		const context = {};

		names.forEach(Array.isArray(names)
				? (name) => context[name] = this._index[name] && this._index[name].promise
				: (alias, name) => context[alias] = this._index[name] && this._index[name].promise);

		const frozen = Object.freeze(context);

		return callback.apply(frozen, args);

	}

	/**
	 * @param {Array<String>|Object<String, String>} names
	 * @param {Function} [callback]
	 * @param {...?} [args]
	 * @return Promise|Object<String, ?>
	 */
	resolve(names, callback, ...args) {

		const context = {};
		const promises = [];

		const getEntry = Array.isArray(names)
				? (alias, name) => this._index[alias]
				: (alias, name) => this._index[name];

		names.forEach((alias, name) => {

			const cacheEntry = getEntry(alias, name);
			if (!cacheEntry) {
				return;
			}

			const promise = cacheEntry.resolve().then((result) => {
				context[alias] = result;
			});

			promises.push(promise);

		});

		return Promise.all(promises).then(() => {
			const frozen = Object.freeze(context);
			return callback
					? callback.apply(frozen, args)
					: frozen;
		});

	}

}
