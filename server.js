// Copyright (c) 2012 Mark Cavage. All rights reserved.


var restify = require('restify');
var serverLogger = require('./util/ServerLogger.js');
var image = require('./bl/Image.js');
var fileBl = require('./bl/FileBl.js');

function createServer() {


    var server = restify.createServer({

        name: 'Log_file',
        version: '0.0.1'
    });

    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());
    server.use(restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('user-name');
    restify.CORS.ALLOW_HEADERS.push('user-type');
    restify.CORS.ALLOW_HEADERS.push('user-id');
    restify.CORS.ALLOW_HEADERS.push('client-id','tenant','__setxhr_');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Credentials");
    restify.CORS.ALLOW_HEADERS.push("GET");
    restify.CORS.ALLOW_HEADERS.push("POST");
    restify.CORS.ALLOW_HEADERS.push("PUT");
    restify.CORS.ALLOW_HEADERS.push("DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers","Access-Control-Expose-Headers","accept,api-version, content-length, content-md5,x-requested-with,content-type, date, request-id, response-time");
    server.use(restify.CORS());
    // Use the common stuff you probably want
    //hard code the upload folder for now
    server.use(restify.plugins.bodyParser({uploadDir:__dirname+'/uploads/'}));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());


    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml|woff2|map)$/i;
    server.get(STATIS_FILE_RE, restify.serveStatic({ directory: './public/docs', default: 'index.html', maxAge: 0 }));
//    server.get(/^\/((.*)(\.)(.+))*$/, restify.serveStatic({ directory: './TruMenuWeb', default: "index.html" }));



    server.get(/\.html$/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    //For 'abc.html?name=zzz'
    server.get(/\.html\?/i,restify.serveStatic({
        directory: './public/docs',
        maxAge: 0}));
    server.get('/',restify.serveStatic({
        directory: './public/docs',
        default: 'index.html',
        maxAge: 0
    }));


    server.get('/api/image/:imageId',image.getImageById);
    server.post({path:'/api/user/:userId/image',contentType: 'multipart/form-data'},image.uploadImage);

    server.get('/api/user/:userId/file' , fileBl.getFileList);
    server.post({path:'/api/user/:userId/file',contentType: 'multipart/form-data'},fileBl.uploadFile);
    server.post({path:'/api/user/:userId/video',contentType: 'multipart/form-data'},fileBl.uploadVideo);
    server.get('/api/user/:userId/file/:fileId' , fileBl.getFile);
    server.get('/api/file/:fileId/video.mp4' , fileBl.getVideo);



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