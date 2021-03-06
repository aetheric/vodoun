/* global describe, beforeEach, afterEach, it */
'use strict';

const _ = require('underscore');
const chai = require('chai');
const Mockito = require('jsmockito');
const Hamcrest = require('jshamcrest');

const ArgumentCaptor = require('../ArgumentCaptor');
const Vodoun = require('../../main/vodoun');
require('./_setup');

global.JsHamcrest = Hamcrest.JsHamcrest;

const mockito = Mockito.JsMockito;
const Verifiers = Mockito.JsMockito.Verifiers;
const Matchers = Hamcrest.JsHamcrest.Matchers;
const expect = chai.expect;

describe('The Vodoun class', () => {

	let vodoun;

	let mockIndex;
	let mockIndexConstructor;

	let mockService;
	let mockServiceConstructor;

	let mockScanner;
	let mockScannerConstructor;

	let mockFiles;
	let mockFilesConstructor;

	let mockMatch;
	let mockMatchConstructor;

	beforeEach(() => {

		mockIndex = mockito.mock(function () {

			this.register = () => {
				console.error('Unstubbed Index#register called!');
				return Promise.reject(new Error('unstubbed'));
			};

			this.resolve = () => {
				console.error('Unstubbed Index#resolve called!');
				return Promise.reject(new Error('unstubbed'));
			};

		});

		mockIndexConstructor = mockito.mockFunction('Index#constructor', () => {
			console.log('Index#constructor called!');
			return mockIndex;
		});

		mockService = mockito.mock(() => {});

		mockServiceConstructor = mockito.mockFunction('Service#constructor', () => {
			console.log('Service#constructor called!');
			return mockService;
		});

		mockScanner = mockito.mock(function () {
			this.scan = () => {
				console.error('Unstubbed Scanner#scan called!');
				return Promise.reject(new Error('unstubbed'));
			}
		});

		mockScannerConstructor = mockito.mockFunction('Scanner#constructor', () => {
			console.log('Scanner#constructor called!');
			return mockScanner;
		});

		mockFiles = mockito.mock(() => {});

		mockFilesConstructor = mockito.mockFunction('Files#constructor', () => {
			console.log('Files#constructor called!');
			return mockFiles;
		});

		mockMatch = mockito.mock(function () {
			this.matches = () => {
				console.error('Unstubbed Match#matches called!');
				return Promise.reject(new Error('unstubbed'));
			}
		});

		mockMatchConstructor = mockito.mockFunction('Match#constructor', () => {
			console.log('Match#constructor called!');
			return mockMatch;
		});

		vodoun = new Vodoun(
				mockIndex,
				mockScanner);
	});

	afterEach(() => {
		mockito.verifyNoMoreInteractions(mockIndex);
		mockito.verifyNoMoreInteractions(mockIndexConstructor);
		mockito.verifyNoMoreInteractions(mockService);
		mockito.verifyNoMoreInteractions(mockServiceConstructor);
		mockito.verifyNoMoreInteractions(mockScanner);
		mockito.verifyNoMoreInteractions(mockScannerConstructor);
		mockito.verifyNoMoreInteractions(mockMatch);
		mockito.verifyNoMoreInteractions(mockMatchConstructor);
		mockito.verifyNoMoreInteractions(mockFiles);
		mockito.verifyNoMoreInteractions(mockFilesConstructor);
	});

	describe('has a function called \'scan\'.', () => {

		let scanBase;
		let glob;

		let matchActionsCaptor;

		beforeEach(() => {

			expect(vodoun.scan).to.be.a('function');

			matchActionsCaptor = new ArgumentCaptor(Matchers.object());
			mockito.when(mockScanner).scan(Matchers.string(), matchActionsCaptor).then((path, actions) => {
				console.log(`Scanner#scan called for ${path} with ${JSON.stringify(_.keys(actions))}`);
				return Promise.resolve();
			});

		});

		it('that when called with no scanBase, throws an error', () => {

			scanBase = undefined;
			glob = '**';

			const result = vodoun.scan(scanBase, glob);

			return expect(result).to.be.rejectedWith(Error).then(() => {

				mockito.verify(mockFilesConstructor, Verifiers.never())();
				mockito.verify(mockMatchConstructor, Verifiers.never())();
				mockito.verify(mockServiceConstructor, Verifiers.never())();

				mockito.verify(mockIndexConstructor, Verifiers.never())();
				mockito.verify(mockScannerConstructor, Verifiers.never())(mockFilesConstructor, mockMatchConstructor);

				mockito.verify(mockScanner, Verifiers.never()).scan(scanBase, matchActionsCaptor);

			});

		});

		it('that when called for the first time, works fine.', () => {

			scanBase = '.';
			glob = '**';

			const result = vodoun.scan(scanBase, glob);

			return expect(result).to.eventually.be.fulfilled.then(() => {

				mockito.verify(mockScanner, Verifiers.once()).scan(scanBase, matchActionsCaptor);
				expect(matchActionsCaptor.value[glob]).to.be.a('function');

			});

		});

		it('that when called for the second time, works fine as well', () => {

			scanBase = '.';
			glob = '**';

			const firstScan = vodoun.scan(scanBase, glob);
			return expect(firstScan).to.eventually.be.fulfilled.then(() => {

				const secondScan = vodoun.scan(scanBase, glob);
				return expect(secondScan).to.eventually.be.fulfilled.then(() => {

					mockito.verify(mockScanner, Verifiers.times(2)).scan(scanBase, matchActionsCaptor);
					expect(matchActionsCaptor.value[glob]).to.be.a('function');

				});

			});

		});

	});

	describe('has a function called \'register\'.', () => {

		beforeEach(() => {
			expect(vodoun.register).to.be.a('function');
			mockito.when(mockIndex).register(Matchers.string(), Matchers.anything(), Matchers.func()).then(() => mockService);
			mockito.when(mockIndex).register(Matchers.string(), Matchers.func()).then(() => mockService);
		});

		it('that when called with bad parameters, throws an error', () => {
			expect(() => vodoun.register()).to.throw(Error);
			expect(() => vodoun.register(undefined, [], () => {})).to.throw(Error);
			expect(() => vodoun.register(undefined, [], () => {})).to.throw(Error);
		});

		it('that when called with good parameters, returns a service.', () => {
			expect(() => vodoun.register('service', [], () => {})).to.equal(mockService);
			expect(() => vodoun.register('service', () => {})).to.equal(mockService);
		})

	});

	describe('has a function called \'resolve\'.', () => {

		let serviceName;

		beforeEach(() => {
			expect(vodoun.resolve).to.be.a('function');
		});

		it('that when called with no parameters, throws an error.', () => {

			serviceName = undefined;

			const result = vodoun.resolve(serviceName);

			return expect(result).to.be.rejectedWith(Error);

		});

		it('that when called before the index is initialised, throws an error.', () => {

			serviceName = 'serviceName';

			const result = vodoun.resolve(serviceName);

			return expect(result).to.be.rejectedWith(Error);

		});

		it('that when called after the index is initialised, passes the call to the index.', () => {

			serviceName = 'serviceName';

			vodoun.scan();

			const result = vodoun.resolve(serviceName);

			mockito.verify(mockIndex, Verifiers.once()).resolve(serviceName);

			return expect(result).to.be.resolvedWith(Matchers.anything());

		});

	});

});
