/* global require */
'use strict';

require('vodoun').register('serviceB', [
	'serviceA'

], (serviceB) => {

	serviceB.validateB = () => {
		return '...never gonna let you down...';
	};

	serviceB.validateA = () => {
		return this.serviceA.validateA;
	};

});
