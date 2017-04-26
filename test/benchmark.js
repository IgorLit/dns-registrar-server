"use strict";

const siege = require('siege');

siege()
    .on(3000)
    .for(10000).times
    .get('http://localhost:3000/api/domains/')
    .attack();