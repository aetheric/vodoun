/* global */
'use strict';

/**
 * @external FilesLib
 * @see fs
 */
/**
 * @function external:FilesLib#stat
 * @param {String} path
 * @param {Function} callback
 */
/**
 * @function external:FilesLib#readdir
 * @param {String} path
 * @param {Function} callback
 */
/**
 * @type FilesLib
 */
import files from 'fs';

import Denodeify from 'es6-denodeify';
import FilesType from '../interfaces/type-files';

const denodeify = new Denodeify(Promise);


/**
 * @class FilesWrapper
 * @implements FilesType
 */
export default class FilesWrapper extends FilesType {

	/**
	 * @constructor
	 */
	constructor() {
		super();

		this._stat = denodeify(files.stat);
		this._readdir = denodeify(files.readdir);

	}

	/** @inheritDoc */
	stat(path) {
		return this._stat(path);
	}

	/** @inheritDoc */
	readdir(path) {
		return this._readdir(path);
	}

}
