/* global console */
'use strict';

const _ = require('underscore');
const ServiceType = require('./interfaces/type-service');

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
module.exports = class Service extends ServiceType {

	/**
	 * @constructor
	 * @param {String} name
	 * @param {Array<String>|Object<String, String>} dependencies
	 * @param {ServiceType.init} init
	 */
	constructor(name, dependencies, init) {
		super();

		this._name = name;
		this._init = init;
		this._dependencies = _.isArray(dependencies)
				? toMap(dependencies)
				: dependencies;

	}

	/** @inheritDoc */
	get name() {
		return this._name;
	}

	/** @inheritDoc */
	get init() {
		return this._init;
	}

	/** @inheritDoc */
	get dependencies() {
		return this._dependencies;
	}

}
