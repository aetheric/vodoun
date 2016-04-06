/* global */
'use strict';

import Vodoun from 'src/main/vodoun';
import Index from 'src/main/index';
import Service from 'src/main/service';
import Resolver from 'src/main/resolver';
import scanner from 'src/main/scanner';

export default new Vodoun(Index, Service, Resolver, scanner);
