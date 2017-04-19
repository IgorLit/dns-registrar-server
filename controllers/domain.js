'use strict';
const jwt = require('jsonwebtoken');
const EasyXml = require('easyxml');

const serializer = new EasyXml({
    singularizeChildren: true,
    underscoreAttributes: true,
    rootElement: 'response',
    dateFormat: 'SQL',
    indent: 2,
    manifest: true
});
module.exports = (domainService, cacheService, config, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(DomainController.prototype, BaseController.prototype);

    function DomainController(domainService, promiseHandler) {
        BaseController.call(this, domainService, promiseHandler);

        this.routes['/'] = [{method: 'get', cb: readAll}, {method: 'post', cb: registerDomain}];
        this.routes['/:id'] = [{method: 'put', cb: pay}, {method: 'get', cb: readById}];
        this.routes['/avaliable/:domain'] = [{method: 'get', cb: check}];

        this.registerRoutes();

        return this.router;

        function registerDomain(req, res) {
            domainService.create(req.body.domain).then((data) => {
                let contentType = req.headers['content-type'];
                if (contentType == 'application/json') {
                    res.header('Content-Type', 'application/json');
                    res.send(data);
                } else if (contentType == 'application/xml') {
                    res.header('Content-Type', 'text/xml');
                    let xml = serializer.render(data.dataValues);
                    res.send(xml);
                } else {
                    res.send(data);
                }
            })
                .catch((err) => res.error(err));

        }

        function readAll(req, res) {
            domainService.readChunk(req.params)
                .then((domains) => {
                    cacheService.set(req, domains);
                    let contentType = req.headers['content-type'];
                    if (contentType == 'application/json') {
                        res.header('Content-Type', 'application/json');
                        res.send(domains);
                    } else if (contentType == 'application/xml') {
                        res.header('Content-Type', 'text/xml');
                        let xml = serializer.render(domains);
                        res.send(xml);
                    } else {
                        res.send(domains);
                    }
                })
                .catch((err) => res.error(err));
        }

        function readById(req, res) {
            domainService.read(req.params.id)
                .then((data) => {
                    let contentType = req.headers['content-type'];
                    if (contentType == 'application/json') {
                        res.header('Content-Type', 'application/json');
                        res.send(data);
                    } else if (contentType == 'application/xml') {
                        res.header('Content-Type', 'text/xml');
                        let xml = serializer.render(data);
                        res.send(xml);
                    } else {
                        res.send(data);
                    }
                })
                .catch((err) => res.error(err));


        }

        function check(req, res) {
            domainService.check(req.params.domain)
                .then((data) => {
                    let contentType = req.headers['content-type'];
                    if (contentType == 'application/json') {
                        res.header('Content-Type', 'application/json');
                        res.send(data);
                    } else if (contentType == 'application/xml') {
                        res.header('Content-Type', 'text/xml');
                        let xml = serializer.render(data);
                        res.send(xml);
                    } else {
                        res.send(data);
                    }
                })
                .catch((err) => res.error(err));
        }

        function pay(req, res) {
            domainService.pay(req.body.domain, req.params.id, req.cookies['x-access-token'])
                .then((data) => {
                    let contentType = req.headers['content-type'];
                    if (contentType == 'application/json') {
                        res.header('Content-Type', 'application/json');
                        res.send(data);
                    } else if (contentType == 'application/xml') {
                        res.header('Content-Type', 'text/xml');
                        let xml = serializer.render(data);
                        res.send(xml);
                    } else {
                        res.send(data);
                    }
                })
                .catch((err) => res.error(err));
        }
    }

    return new DomainController(domainService, promiseHandler);
};