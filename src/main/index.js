/* global require */
'use strict';

import Service from './service'

export default class Index {

	constructor() {
		this._index = {};
	}

	/**
	 * @param {Service} service
	 */
	add(service) {
		this._index[service.name] = service;
	}

	/**
	 * @param {String} name
	 * @returns {Service}
	 */
	get(name) {
		return this._index[name];
	}

}
