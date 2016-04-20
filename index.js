/* global */
'use strict';

import fs from 'fs';
import Minimatch from 'minimatch';
import Vodoun from './src/main/vodoun';
import Index from './src/main/index';
import Service from './src/main/service';
import Scanner from './src/main/scanner';
import Files from './src/main/util/promised-files';
import './src/main/util/interfaces'

const matchers = {

	matcher: (glob) => {
		const matcher = new Minimatch(glob);
		return {
			matches: (path) => {
				return matcher.match(path);
			}
		}
	}

};

const index = new Index(Service);

const files = new Files(fs);

const scanner = new Scanner(files, matchers);

export default new Vodoun(index, scanner);
