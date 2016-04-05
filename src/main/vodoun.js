/* global require */
'use strict';

import Index from './index'
import Service from './service'
import scanner from './scanner'

let index;

/**
 * @callback register~init
 * @this {Object} context
 */
/**
 * @param {String} name
 * @param {Array<String>|Object<String, String>} dependencies
 * @param {register~init} init
 */
export const register = (name, dependencies, init) => {

	if (!index) {
		throw new Error("Index has not been initialised yet.");
	}

	if (index[name]) {
		throw new Error("Service called ${name} already added to index.")
	}

	index.add(new Service(name, dependencies, init));

};

export const scan = (scanBase, glob) => {

	if (index) {
		throw new Error("An index has already been initialised.");
	}

	index = new Index();

	scanner(scanBase, {

		[glob]: (fileMatch) => {
			// services should add themselves to the index.
			const module = require(fileMatch);
		}

	});

};
