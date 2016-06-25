/* global describe, it, beforeEach, afterEach, console */
'use strict';

const chai = require('chai');
const Mockito = require('jsmockito');
const Hamcrest = require('jshamcrest');
const ArgumentCaptor = require('../ArgumentCaptor');
const Index = require('../../main/index');
const Service = require('../../main/service');
require('./_setup');

const expect = chai.expect;
const mockito = Mockito.JsMockito;
const verifiers = mockito.Verifiers;
const matchers = Hamcrest.JsHamcrest.Matchers;

describe('The Index class', () => {

	let index;

	let mockServiceTypeConstructor;

	beforeEach(() => {

		mockServiceTypeConstructor = mockito.mockFunction(Service, () => {
			console.info('ServiceType#constructor called!');
		});

		index = new Index(mockServiceTypeConstructor);

	});

	afterEach(() => {
		//mockito.verifyNoMoreInteractions(mockServiceTypeConstructor);
	});

	it('should allow registering services', () => {

		const serviceName = 'service';
		const dependencies = [];
		const init = () => {};

		const result = index.register(serviceName, dependencies, init);

		expect(result).to.be.a(Service);

		mockito.verify(mockServiceTypeConstructor, verifiers.once())(serviceName, dependencies, init);

	});

	it('should override the previous registration if a service is added twice', () => {

		const serviceName = 'service';
		const initA = () => { };
		const initB = () => { };

		const initCaptor = new ArgumentCaptor(matchers.func());
		mockito.when(mockServiceTypeConstructor)(serviceName, matchers.anything(), initCaptor);

		index.register(serviceName, [], initA);
		index.register(serviceName, [], initB);

		mockito.verify(mockServiceTypeConstructor, verifiers.times(2))(serviceName, matchers.anything(), initCaptor);
		expect(initCaptor.value).to.equal(initB);

	});

	it('should retrieve a known service without problems', () => {

		const serviceName = 'service';
		const init = (context) => {
			context.verified = true;
		};

		index.register(serviceName, [], init);

		const result = index.resolve('service');

		expect(result).to.be.a('Promise');

		return expect(result).to.be.fulfilled.then((service) => {

			expect(service.verified).to.equal(true);

			mockito.verify(mockServiceTypeConstructor, verifiers.once());

		});

	});

	it('should throw an error if dependencies can\'t be met.', () => {

		const serviceName = 'badservice';

		index.register(serviceName, [ 'missingdep' ], () => {});

		const result = index.resolve(serviceName);

		return expect(result).to.be.rejectedWith(Error).then(() => {

			mockito.verify(mockServiceTypeConstructor, verifiers.once());

		});

	});

	it('should resolve dependencies registered in any order', () => {

		const serviceNameA = 'service';
		const serviceNameB = 'otherservice';

		index.register(serviceNameA, [ serviceNameB ], function () {
			expect(this[serviceNameB].verified).to.equal(true);
		});

		index.register(serviceNameB, [], (service) => {
			service.verified = true;
		});

		const result = index.resolve('service');

		return expect(result).to.be.fulfilled.then(() => {

			mockito.verify(mockServiceTypeConstructor, verifiers.once());

		});

	});

});
