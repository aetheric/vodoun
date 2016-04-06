/* global describe, beforeEach */
'use strict';

import Vodoun from '../main/vodoun';

describe('The Vodoun class', function () {

	var vodoun;
	var mockIndex;
	var mockService;
	var mockScanner;

	beforeEach(function () {
		mockIndex = null;
		mockService = null;
		mockScanner = null;
		vodoun = new Vodoun(
				mockIndex,
				mockService,
				mockScanner);
	});

});
