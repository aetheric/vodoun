/* global describe, beforeEach, before, it */
'use strict';

import chai from 'chai';

import Service from '../main/service';

const expect = chai.expect;

describe('The Service class', function () {

	/** @type {Service} */
	var service;

	/** @type {String} */
	var serviceName;

	/** @type {Function} */
	var serviceInit;

	/** @type {Array|Object<String, String>} */
	var serviceDeps;

	it("will behave in an expectable manner when provided with unremarkable values", () => {

		serviceName = "serviceName";
		serviceDeps = {};
		serviceInit = function (service) {
			expect(service).not.to.be.null;
		};

		service = new Service(serviceName, serviceDeps, serviceInit);

		expect(service.name).to.equal(serviceName);
		expect(service.init).to.equal(serviceInit);
		expect(service.dependencies).to.equal(serviceDeps);

	});

});
