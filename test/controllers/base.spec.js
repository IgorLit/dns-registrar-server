'use strict';

let data = {
    12 : {
        id: 12,
        name: 'domain.com'
    }
};
const service = require('../mocks/service')(data);
const BaseController = require('../../controllers/base');

let baseController = new BaseController(service, promiseHandler);

describe('Test set for Controller.Base', () => {

    describe('>>Module', () => {

        test('Should imported function', () => {
            expect(typeof BaseController).toBe('function');
        });

        test('Should create object', () => {
            expect(typeof baseController).toBe('object');
        });

    });

    describe('>> Reading ', () => {
        test('Should call readChunk  function from service', async() =>{
            await baseController.readAll({params:{}});
            expect(service.readChunk)
                .toHaveBeenCalledTimes(1);
        });

        test('Should call read  function from service', async() =>{
            await baseController.read({params:{}});
            expect(service.read)
                .toHaveBeenCalledTimes(1);
        });
    });

    describe('>> Creating ', () => {
        test('Should call create  function from service', async() =>{
            await baseController.create({params:{}});
            expect(service.create)
                .toHaveBeenCalledTimes(1);
        })
    });

    describe('>> Updating ', () => {
        test('Should call update  function from service', async() =>{
            await baseController.update({body:{}});
            expect(service.update)
                .toHaveBeenCalledTimes(1);
        })
    });

    describe('>> Deleting ', () => {
        test('Should call delete  function from service', async() =>{
            await baseController.del({body:{}});
            expect(service.delete)
                .toHaveBeenCalledTimes(1);
        })
    });

});

function promiseHandler(res, promise) {
    promise
        .then((data) => res.send(data))
        .catch((err) => res.error(err));
}
