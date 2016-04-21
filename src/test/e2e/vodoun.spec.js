/* global describe, it, before, beforeEach, afterEach, after */
'use strict';

import { mockVodoun, testDir, expect } from './_setup';

describe('The vodoun system', () => {

	let vodoun = null;

	beforeEach(() => {
		return mockVodoun.then((instance) => {
			vodoun = instance;
		});
	});

	it('will successfully scan the nominated path', () => {
		return vodoun.scan(testDir);
	});

	describe('once the path is scanned', () => {

		beforeEach(() => {
			return vodoun.scan(testDir);
		});

		it('will resolve dependencies as neccesary', () => {
			return vodoun.resolve('serviceA');
		});

		it('will resolve other dependencies', () => {
			return vodoun.resolve('serviceB');
		});

		it('will resolve really complicated dependencies as well', () => {
			return vodoun.resolve('Service C');
		});

	});

});
