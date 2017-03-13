/**
 * Created by ling xue on 14-4-29.
 */

var assert = require('assert-plus');
var bunyan = require('bunyan');
var sysConfig = require('../config/SystemConfig.js');

var HttpError = require('restify-errors').HttpError;;



function ServerLogger(options) {
    assert.object(options, 'options');
    assert.object(options.log, 'options.log');

    var log = options.log.child({
        audit: true,
        serializers: {
            err: bunyan.stdSerializers.err,
            req: function auditRequestSerializer(req) {
                if (!req)
                    return (false);

                var timers = {};
                (req.timers || []).forEach(function (time) {
                    var t = time.time;
                    var _t = Math.floor((1000000 * t[0]) +
                        (t[1] / 1000));
                    timers[time.name] = _t;
                });
                return ({
                    method: req.method,
                    url: req.url,
                    headers: req.headers,
                    httpVersion: req.httpVersion,
                    trailers: req.trailers,
                    version: req.version(),
                    body: options.body === true ?
                        req.body : undefined,
                    timers: timers
                });
            },
            res: function auditResponseSerializer(res) {
                if (!res)
                    return (false);


                var body;
                if (options.body === true) {
                    if (res._body instanceof HttpError) {
                        body = res._body.body;
                    } else {
                        body = res._body;
                    }
                }

                return ({
                    statusCode: res.statusCode,
                    headers: res._headers,
                    trailer: res._trailer || false,
                    body: body
                });
            }
        }
    });

    function audit(req, res, route, err) {
        var latency = res.get('Response-Time');
        if (typeof (latency) !== 'number')
            latency = Date.now() - req._time;

        var obj = {
            remoteAddress: req.connection.remoteAddress,
            remotePort: req.connection.remotePort,
            authToken: req.headers['auth-token'],
            method : req.method,
            url : req.url,
            statusCode : res.statusCode,
            err: err,
            latency: latency
        };

        log.info(obj, 'handled: %d', res.statusCode);

        return (true);
    }

    return (audit);
}


function createLogger(name){
    var log4js = require('log4js');
    log4js.configure(sysConfig.loggerConfig);
    var logger = log4js.getLogger(name);
    logger.setLevel(sysConfig.logLevel);
    return logger;
}

///-- Exports

module.exports = {
    ServerLogger : ServerLogger,
    createLogger : createLogger
};

