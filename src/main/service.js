/* global */
'use strict';

import _ from 'underscore';

/**
 * @param {Array<String>} array
 * @return {Object<String, String>}
 */
function toMap(array) {
	return _.reduce(array, (map, item) => {
		map[item] = item;
		return map;
	}, {});
}

export default class Service {

	/**
	 * @callback constructor~init
	 * @this {Object} context
	 */
	/**
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {constructor~init} init
	 */
	constructor(name, dependencies, init) {
		this._name = name;
		this._init = init;
		this._dependencies = _.isArray(dependencies)
				? toMap(dependencies)
				: dependencies;
	}

	/**
	 * @returns {String}
	 */
	get name() {
		return this._name;
	}

	/**
	 * @returns {constructor~init}
	 */
	get init() {
		return this._init;
	}

	/**
	 * @returns {Object<String, String>}
	 */
	get dependencies() {
		return this._dependencies;
	}

}
