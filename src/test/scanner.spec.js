/* global describe, beforeEach, it */
'use strict';

import files from 'fs';
import chai from 'chai';
import Mockito from 'jsmockito';
import Hamcrest from 'jshamcrest';

import ArgumentCaptor from './util/ArgumentCaptor';
import Scanner from '../main/scanner';
import FilesType from '../main/interfaces/type-files';
import MatchersType from '../main/interfaces/type-matchers';

import './util/setup';

const expect = chai.expect;
const mockito = Mockito.JsMockito;
const matchers = Hamcrest.JsHamcrest.Matchers;

describe('The Scanner class', () => {

	it('should reject if the file stat throws an error', () => {

		return;

		const scanBase = '.';
		const error = new Error('expected');

		/** @type FilesType */
		const filesMock = mockito.mock(FilesType);

		/** @type MatchersType */
		const matchersMock = mockito.mock(MatchersType);

		const pathCaptor = new ArgumentCaptor(matchers.string());
		const callbackCaptor = new ArgumentCaptor(matchers.func());
		mockito.when(filesMock).stat(pathCaptor, callbackCaptor).then(() => {
			console.log(`files.stat called for ${pathCaptor.value}.`);
			expect(pathCaptor.value).to.equal(scanBase);
			callbackCaptor.value.call(undefined, error, null);
		});

		const scanner = new Scanner(filesMock, matchersMock);
		const result = scanner.scan(scanBase, {});

		return expect(result).to.be.rejectedWith(error);

	});

	it('should reject if the file stat throws an error', () => {

		return;

		const scanBase = '.';
		const scanGlob = '*';
		const error = new Error('expected');

		const filesMock = mockito.mock(Files);
		const statsMock = mockito.mock(files.Stats);
		const minimatchMock = mockito.mockFunction(minimatch);

		mockito.when(statsMock).isFile().thenReturn(true);

		const callbackCaptor = new ArgumentCaptor(matchers.func());
		mockito.when(filesMock).stat(matchers.string(), callbackCaptor).then(() => {
			callbackCaptor.value(null, statsMock);
		});

		const scanner = new Scanner(filesMock, minimatchMock);
		const result = scanner.scan(scanBase, {

			[scanGlob]: (file) => {
				//
			}

		});

		return expect(result).to.be.rejectedWith(error);

	});

});
