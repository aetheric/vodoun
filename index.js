/* global require, module */
'use strict';

const Files = require('./src/main/util/wrapper-files');
const Matchers = require('./src/main/util/wrapper-matchers');
const Vodoun = require('./src/main/vodoun');
const Index = require('./src/main/index');
const Service = require('./src/main/service');
const Scanner = require('./src/main/scanner');

const matchers = new Matchers();

const index = new Index(Service);

const files = new Files();

const scanner = new Scanner(files, matchers);

module.exports = new Vodoun(index, scanner);
