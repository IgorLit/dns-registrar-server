'use strict';
const DomainController = require('../../controllers/domain');

describe('>> Domain Controller Module', () => {
    test('Should imported function', () => {
        expect(typeof DomainController).toBe('function');
    });
});