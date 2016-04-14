/* global */
'use strict';

import Hamcrest from 'jshamcrest';

/**
 * @template CapturedType
 */
export default class ArgumentCaptor extends Hamcrest.JsHamcrest.SimpleMatcher {

	/**
	 * @param {Hamcrest.JsHamcrest.SimpleMatcher} [matcher]
	 */
	constructor(matcher = null) {
		super();
		this._matcher = matcher;
	}

	/**
	 * @param {CapturedType} actual
	 * @returns {Boolean}
	 */
	matches(actual) {
		this._value = actual;
		return this._matcher
				? this._matcher(actual)
				: true;
	}

	/**
	 * @param {Hamcrest.JsHamcrest.Description} description
	 */
	describeTo(description) {
		description.append("Argument Captor");
	}

	/**
	 * @returns {CapturedType}
	 */
	get value() {
		return this._value;
	}

}
