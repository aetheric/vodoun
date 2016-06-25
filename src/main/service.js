/* global console */
'use strict';

const _ = require('underscore');

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

/**
 * @class Service
 * @implements ServiceType
 */
module.exports = class Service {

	/**
	 * @constructor
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {ServiceType.init} init
	 */
	constructor(name, dependencies, init) {

		this._name = name;
		this._init = init;
		this._dependencies = _.isArray(dependencies)
				? toMap(dependencies)
				: dependencies;

	}

	/**
	 * @property
	 * @returns {String}
	 */
	get name() {
		return this._name;
	}

	/**
	 * @callback ServiceType.init
	 * @this {Object<String, ?>} context
	 * @param {Object<String, ?>} service
	 * @param {Object<String, ?>} context
	 * @returns {Promise|.}
	 */
	/**
	 * @property
	 * @returns {ServiceType.init}
	 */
	get init() {
		return this._init;
	}

	/**
	 * @property
	 * @returns {Object<String, String>}
	 */
	get dependencies() {
		return this._dependencies;
	}

};
