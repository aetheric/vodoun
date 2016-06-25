/* global beforeEach */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');
const mockRequire = require('mock-require');
import * as fs from 'fs-extra-promise-es6';

const DeferredPromise = require('../DeferredPromise');
const Files = require('src/main/util/wrapper-files');
const Matchers = require('src/main/util/wrapper-matchers');
const Vodoun = require('src/main/vodoun');
const Index = require('src/main/index');
const Service = require('src/main/service');
const Scanner = require('src/main/scanner');

export const expect = chai.expect;
export const testDir = path.resolve('target/testing/e2e');
export let mockVodoun = new DeferredPromise();

before(() => {
	chai.use(chaiAsPromised);
});

beforeEach(() => {

	const matchers = new Matchers();
	const index = new Index(Service);
	const files = new Files();
	const scanner = new Scanner(files, matchers);
	const vodoun = new Vodoun(index, scanner);

	mockRequire('vodoun', vodoun);

	return fs.ensureDir('target/testing').then(() => {
		return fs.copy('src/test/e2e/res', 'target/testing/e2e', {
			clobber: true
		});

	}).then(() => {
		return mockVodoun.resolve(vodoun);

	}).catch((error) => {
		mockVodoun.reject(error);
		throw error;
	});

});
