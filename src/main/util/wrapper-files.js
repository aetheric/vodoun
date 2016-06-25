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
 * @type {FilesLib}
 */
const files = require('fs');

/**
 * @class FilesWrapper
 * @implements FilesType
 */
module.exports = class FilesWrapper {

	/**
	 * @constructor
	 */
	constructor() {

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

	/**
	 * @typedef StatType
	 */
	/**
	 * @function StatType#isFile
	 * @returns {Boolean}
	 */
	/**
	 * @function StatType#isDirectory
	 * @returns {Boolean}
	 */
	/**
	 * @function
	 * @param {String} path
	 * @returns {Promise<StatType>}
	 */
	stat(path) {
		return this._stat(path);
	}

	/**
	 * @function
	 * @param {String} path
	 * @returns {Promise<Array<String>>}
	 */
	readdir(path) {
		return this._readdir(path);
	}

};
