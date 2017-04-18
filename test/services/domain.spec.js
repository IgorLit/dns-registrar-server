'use strict';
const data = {
    42: {
        id: 42,
        name: 'abc.com'
    }
};

const users = {
    4: {
        id: 4,
        name: 'Igor'
    }
};
const Domain = require('../../services/domain');
const errors = require('../../utils/errors');
const domainRepository = require('../mocks/repository')(data);
const userRepository = require('../mocks/userRepository')(users);
const Promise = require("bluebird");
const service = Domain(domainRepository, userRepository, errors);


describe('Test set for Service.Domain', () => {
    beforeEach(() => domainRepository.mockClear());
    beforeEach(() => userRepository.mockClear());

    describe('>> Module', () => {
        test('Should imported function', () => {
            expect(typeof Domain).toBe('function');
        });

        test('Should created object', () => {
            expect(typeof service).toBe('object');
        });
    });

    describe('>> Check', () => {
        test('Should returned  bluebird-promise', () => {
            expect(service.check())
                .toBeInstanceOf(Promise);
        });

        test('Should returned object if domain already used', async () => {
            let record = await service.check('vk.com');

            expect(record).toEqual({status: "domain already use"});
        });

        test('Should returned object if domain free', async () => {
            let record = await service.check('ewewxsdsdadadasfds.com');

            expect(record).toEqual({status: "domain free"});
        });
    });


    describe('>> Pay ', () => {
        it('Should returned  bluebird-promise', () => {
            expect(service.pay())
                .toBeInstanceOf(Promise);
        });

        var useAccessTocken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfX3VzZXJfaWQiOjQsImlhdCI6MTQ5MjUzMTgyNn0.J1jigUGnWqlsyduw0-PRBEK2TI9JemugNNYeuI31iu4';

        it('Should returned object if success', async () => {
            let record = await service.pay('abc.com', 42, useAccessTocken);

             expect(record)
             .toEqual({success: true});
        });
    });
});