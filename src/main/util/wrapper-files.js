/* global require, module */
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
const files = require('fs');

const FilesType = require('../interfaces/type-files');

/**
 * @class FilesWrapper
 * @implements FilesType
 */
module.exports = class FilesWrapper extends FilesType {

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
