/* global */
'use strict';

import fs from 'fs';
import Minimatch from 'minimatch';

import Vodoun from 'src/main/vodoun';
import Index from 'src/main/index';
import Service from 'src/main/service';
import Scanner from 'src/main/scanner';
import Files from 'src/main/wrapper/files';

export default new Vodoun(Index, Service, Scanner, new Files(fs), Minimatch);
