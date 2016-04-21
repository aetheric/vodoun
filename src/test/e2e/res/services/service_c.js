/* global require */
'use strict';

require('vodoun').register('Service C', {
	'serviceA': 'Service A',
	'serviceB': 'Service B'

}, (serviceC) => {

	serviceC.validateC = () => {
		return 'Never gonna give you up...';
	};

	serviceC.validateB = () => {
		return this['Service B'].validateB;
	};

	serviceC.validateBvalidateA = () => {
		return this['Service B'].validateA;
	};

	serviceC.validateA = () => {
		return this['Service A'].validateA;
	};

});
