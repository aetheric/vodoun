/* global */
'use strict';

import Files from './src/main/util/wrapper-files';
import Matchers from './src/main/util/wrapper-matchers';
import Vodoun from './src/main/vodoun';
import Index from './src/main/index';
import Service from './src/main/service';
import Scanner from './src/main/scanner';

const matchers = new Matchers();

const index = new Index(Service);

const files = new Files();

const scanner = new Scanner(files, matchers);

export default new Vodoun(index, scanner);
