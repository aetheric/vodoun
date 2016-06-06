/* global beforeEach */
'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import mockRequire from 'mock-require';
import * as fs from 'fs-extra-promise-es6';

import DeferredPromise from '../DeferredPromise';
import Files from 'src/main/util/wrapper-files';
import Matchers from 'src/main/util/wrapper-matchers';
import Vodoun from 'src/main/vodoun';
import Index from 'src/main/index';
import Service from 'src/main/service';
import Scanner from 'src/main/scanner';

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
