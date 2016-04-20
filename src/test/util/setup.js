/* global before */
'use strict';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

before(() => {
	chai.use(chaiAsPromised);
});

