'use strict';
const jwt = require('jsonwebtoken');
var request = require('request');

module.exports = (domainRepository, userRepository, errors) => {
    const BaseService = require('./base');
    const needle = require("needle");
    var Promise = require("bluebird");
    Promise.promisifyAll(needle);

    Object.setPrototypeOf(DomainService.prototype, BaseService.prototype);

    function DomainService(domainRepository, errors) {
        BaseService.call(this, domainRepository, errors);

        let self = this;

        self.create = create;
        self.update = update;
        self.check = check;
        self.pay = pay;

        function create(domainName) {
            return new Promise((resolve, reject) => {
                let domain = {
                    name: domainName,
                    status: "not paid"
                };
                self.baseCreate(domain)
                    .then((domain) => {
                        resolve(domain)
                    }).catch((err)=>reject(err));
            });
        }

        function update(data) {
            return new Promise((resolve, reject) => {
                let post = {
                    title: data.title,
                    content: data.content,
                    date: data.date,
                    draft: data.draft
                };

                self.baseUpdate(data.id, post)
                    .then(resolve).catch(reject);
            });
        }

        function check(domain) {
            return new Promise((resolve, reject) => {
                request({
                    headers: {
                        'Origin': 'https://www.namecheap.com/',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    uri: 'https://api.domainr.com/v2/status?domain=' + domain + '&client_id=fb7aca826b084569a50cfb3157e924ae',
                    method: 'get'
                }, function (err, response, body) {
                    if ((JSON.parse(body).status[0].summary === "inactive") || (JSON.parse(body).status[0].summary === "undelegated")) {
                        domainRepository.findAll(
                            {
                                where: {name: domain}
                            })
                            .then((domain) => {
                                if (domain.length != 0) {
                                    resolve({status: "domain already use"})

                                }
                                else {
                                    resolve({status: "domain free"})
                                }
                            })
                            .catch(reject);
                    }
                    else if (JSON.parse(body).status[0].summary === "active") {
                        resolve({status: "domain already use"})
                    }

                })
            })
        }

        function pay(domainName, id, tokenUserId) {
            return new Promise((resolve, reject) => {

                if (tokenUserId) {
                    jwt.verify(tokenUserId, 'shhhhh', function (err, decoded) {
                        if (err != null) reject(errors.Unauthorized);
                        var userId = decoded.__user_id;

                        var domain = {
                            status: "paid"
                        };
                        Promise.all([
                            domainRepository.findById(id),
                            userRepository.findById(userId)
                        ]).spread((dmn, user) => {
                            if (dmn.status == "paid")
                                reject({status: "domain already use"});
                            console.log(dmn.id);
                            return Promise.all([
                                user.addDomain(dmn),
                                user.decrement({cache: 20}),
                                self.baseUpdate(dmn.id, {
                                    name: dmn.name,
                                    status: "paid"
                                })
                            ]);
                        }).spread((domain, user, dmn) => {
                            if (user.cache - 20 < 0) reject(errors.PaymentRequired)  //TODO: 20 - price for domen. move to confif
                            resolve({success: true})
                        })
                            .catch(reject);
                    })
                }
                else {
                    reject(errors.Unauthorized)
                }
            });
        }
    }

    return new DomainService(domainRepository, errors);
};