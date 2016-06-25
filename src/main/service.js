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
 * @property {String}                 name         - The service name.
 * @property {Service#init}           init         - The service constructor.
 * @property {Object<String, String>} dependencies - The service dependencies.
 */
module.exports = class Service {

	/**
	 * @constructor
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {Service#init} init
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
	 * @callback ServiceType#init
	 * @this {Object<String, ?>} context
	 * @param {Object<String, ?>} service
	 * @param {Object<String, ?>} context
	 * @returns {Promise|undefined}
	 */
	/**
	 * @returns {Service#init}
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

};
