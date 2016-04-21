/* global require */
'use strict';

require('vodoun').register('serviceA', [], (serviceA) => {

	serviceA.validateA = () => {
		return '...never gonna run around, and hurt you.'
	};

});
