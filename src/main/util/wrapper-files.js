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

import FilesType from '../interfaces/type-files';

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

		this._stat = (path) => new Promise((resolve, reject) => {
			files.stat(path, (error, stat) => {

				if (error) {
					return reject(error);
				}

				return resolve(stat);

			});
		});


		this._readdir = (path) => new Promise((resolve, reject) => {
			files.readdir(path, (error, paths) => {

				if (error) {
					return reject(error);
				}

				return resolve(paths);

			});
		});

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
