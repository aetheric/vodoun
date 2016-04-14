/* global describe, beforeEach, it */
'use strict';

import chai from 'chai';

import Index from '../main/index';

import './setup';

const expect = chai.expect;

describe('The Index class', () => {

	var index;

	beforeEach(() => {
		index = new Index();
	});

	it('should allow registering services', () => {
		return index.register('service', [], () => {});
	});

	it('should throw an error if a service is added twice', () => {
		index.register('service', [], () => {});
		return expect(() => index.register('service', [], () => {})).to.throw(Error);
	});

	it('should retrieve a known service without problems', () => {
		index.register('service', [], () => {});
		return expect(index.resolve('service')).to.be.fulfilled;
	});

	it('should throw an error if dependencies can\'t be met.', () => {
		index.register('badservice', [ 'missingdep' ], () => {});
		return expect(index.resolve('badservice')).to.be.rejectedWith(Error);
	});

	it('should resolve dependencies', () => {
		index.register('otherservice', [], () => {});
		index.register('service', [ 'otherservice' ], () => {});
		return expect(index.resolve('service')).to.be.fulfilled;
	});

});
