// Copyright (c) 2012 Mark Cavage. All rights reserved.


var restify = require('restify');
var serverLogger = require('./util/ServerLogger.js');
var image = require('./bl/Image.js');

function createServer() {


    var server = restify.createServer({

        name: 'Log_file',
        version: '0.0.1'
    });

    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());
    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('client-id');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Credentials");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods","DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","accept,api-version, content-length, content-md5,x-requested-with,content-type, date, request-id, response-time");
    server.use(restify.CORS({ headers: [ 'client-id' ], origins: ['*'] }));
    server.use(restify.CORS({ headers: [ 'auth-token' ], origins: ['*'] }));
    server.use(restify.CORS({ headers: [ 'tenant' ], origins: ['*'] }));
    server.use(restify.CORS({ headers: [ '__setxhr_' ], origins: ['*'] }));
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());
    server.use(restify.fullResponse());
    server.use(restify.bodyParser({uploadDir:__dirname+'/uploads/'}));

    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml)$/i;
    server.get(/\/apidoc\/?.*/, restify.serveStatic({
        directory: './public'
    }));
    server.get('/api/user/:userId/image/:imageId',image.getImageById);
    server.post({path:'/api/user/:userId/image',contentType: 'multipart/form-data'},image.uploadImage);



    server.on('NotFound', function (req, res, next) {
        res.send(404);
        next();
    })
    server.on('MethodNotAllowed', function (req, res, next) {
        console.log(req);
        res.send(404);
        next();
    })
    return (server);
}



///--- Exports

module.exports = {
    createServer: createServer
};