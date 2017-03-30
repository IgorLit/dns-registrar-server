'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
module.exports = (authService, config) => {
    const router = express.Router();

    router.post('/', (req, res) => {
        authService.login(req.body)
            .then((userId) => {
                let token = jwt.sign({ __user_id: userId }, 'shhhhh');
                res.cookie('x-access-token',token);
                res.json({ success: true });
            })
            .catch((err) => res.error(err));
    });

    router.post('/', (req, res) => {
        authService.register(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.error(err));
    });

    router.get('/logout', (req, res) => {
        res.cookie(config.cookie.auth, '');
        res.json({ success: true });
    });

    return router;
};