/* global beforeEach */
'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');
const mockRequire = require('mock-require');
const fs = require('fs-extra-promise-es6');

const DeferredPromise = require('../DeferredPromise');
const Files = require('../../main/util/wrapper-files');
const Matchers = require('../../main/util/wrapper-matchers');
const Vodoun = require('../../main/vodoun');
const Index = require('../../main/index');
const Service = require('../../main/service');
const Scanner = require('../../main/scanner');

const out = module.exports = {
	expect: chai.expect,
	testDir: path.resolve('target/testing/e2e'),
	mockVodoun: new DeferredPromise()
};

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
		return out.mockVodoun.resolve(vodoun);

	}).catch((error) => {
		out.mockVodoun.reject(error);
		throw error;
	});

});
