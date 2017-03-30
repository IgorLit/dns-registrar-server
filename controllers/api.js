'use strict';
const express = require('express');

module.exports = (domainService, userService, authService, cacheService, config) => {
    const router = express.Router();

    const domainController = require('./domain')(domainService, cacheService,config, promiseHandler);
    const userController = require('./user')(userService, promiseHandler);
    const authController = require('./auth')(authService, config);

    router.use('/domains', domainController);
    router.use('/users', userController);
    router.use('/session', authController);

    return router;
};

function promiseHandler(res, promise) {
    promise
        .then((data) => {
            res.send(data)
        })
        .catch((err) => res.error(err));
}