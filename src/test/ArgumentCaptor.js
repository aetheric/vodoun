/* global require, module */
'use strict';

const Hamcrest = require('jshamcrest');

/**
 * @template CapturedType
 */
module.exports = class ArgumentCaptor extends Hamcrest.JsHamcrest.SimpleMatcher {

	/**
	 * @param {Hamcrest.JsHamcrest.SimpleMatcher} [matcher]
	 */
	constructor(matcher = null) {
		super();

		/**
		 * @param {CapturedType} actual
		 * @returns {Boolean}
		 */
		this.matches = matcher ? (actual) => {
			this._value = actual;
			return matcher.matches(actual);

		} : (actual) => {
			this._value = actual;
			return true;
		};

		/**
		 * @param {Hamcrest.JsHamcrest.Description} description
		 */
		this.describeTo = (description) => {
			description.append("Argument Captor");
		}

	}

	/**
	 * @returns {CapturedType}
	 */
	get value() {
		return this._value;
	}

};
