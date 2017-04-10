"use strict";

const siege = require('siege');

siege('../../index.js')
    .on(3000)
    .for(100000).times
    .get('http://localhost:3000/api/domains/')
    .attack();