/* global */
'use strict';

import filesystem from 'fs';
import Denodeify from 'es6-denodeify';

const denodeify = new Denodeify(Promise);

export default class Files {

	/**
	 * @param {filesystem} fs
	 */
	constructor(fs = filesystem) {

		this.stat = denodeify(fs.stat);

		this.readdir = denodeify(fs.readdir);

	}

}
