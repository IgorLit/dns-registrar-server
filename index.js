'use strict';

const express = require('express');
const Sequelize = require('sequelize');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

require('body-parser-xml')(bodyParser);
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    underscoreAttributes: true,
    rootElement: 'response',
    dateFormat: 'SQL',
    indent: 2,
    manifest: true
});
const errors = require('./utils/errors');
const config = require('./config');

const dbcontext = require('./context/db')(Sequelize, config);

const domainService = require('./services/domain')(dbcontext.domain, dbcontext.user, errors);
const userService = require('./services/user')(dbcontext.user, dbcontext.role, errors);
const authService = require('./services/auth')(dbcontext.user, dbcontext.role, errors);
const cacheService = require('./services/cache');

const apiController = require('./controllers/api')(domainService, userService,
    authService, cacheService, config);

const logger = require('./utils/logger');
const auth = require('./utils/auth')(authService, config, errors);
const cache = require('./utils/cache')(cacheService);

const app = express();

app.use(express.static('public'));
app.use(cookieParser(config.cookie.key));
app.use(bodyParser.json());
app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    }
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api', logger);
app.use('/api', auth);
app.use('/api', cache);
app.use('/api', apiController);

app.use('/panel.html', function (req,res) {
    console.log("panel");
    res.end();
});

app.use('/api',function(req, res, next) {
    res.sendData = function(obj) {
        var contentType = req.headers['content-type'];
        if (contentType == 'application/json') {
            res.header('Content-Type', 'application/json');
            res.send(obj);
        } else if (contentType == 'application/xml') {
            res.header('Content-Type', 'text/xml');
            var xml = serializer.render(obj);
            res.send(xml);
        } else {
            res.send(obj);
        }
    };
    next();
});
app.set('port', (process.env.PORT || 3000));
console.log(process.env.NODE_ENV);
dbcontext.sequelize
    .sync()
    .then(() => {
        app.listen(app.get('port'), () => console.log('Running on' + app.get('port')));
    })
    .catch((err) => console.log(err));