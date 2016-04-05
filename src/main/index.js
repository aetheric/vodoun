/* global require */
'use strict';

import scanner from './scanner';

export default class Index {

	constructor(scanBase, glob) {
		this._index = {};

		scanner(scanBase, {

			[glob]: (fileMatch) => {
				const module = require(fileMatch);
				const name = module.name || fileMatch; //TODO: transform filematch to relative with '.' separators.
				this._index[name] = Promise.resolve(module);
			}

		});

	}

	/**
	 * @param {String} name
	 * @returns {Promise<?>}
	 */
	resolve(name) {
		return this._index[name];
	}

}
