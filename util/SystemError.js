/**
 * Created by Ling Xue on 14-5-4.
 */
var restify = require('restify');
var sysMsg = require('./SystemMsg.js');

var CODES = {
    BadDigest: 400,
    BadMethod: 405,
    Internal: 500, // Don't have InternalErrorError
    InvalidArgument: 409,
    InvalidContent: 400,
    InvalidCredentials: 401,
    InvalidHeader: 400,
    InvalidVersion: 400,
    MissingParameter: 409,
    NotAuthorized: 403,
    PreconditionFailed: 412,
    RequestExpired: 400,
    RequestThrottled: 429,
    ResourceNotFound: 404,
    WrongAccept: 406
};

function InvalidArgumentError(msg , outMsg){
    var error = new restify.InvalidArgumentError(msg);
    if(outMsg){
        error.body.outMsg = outMsg;
    }
    return error;
}

function NotAuthorizedError(){
    var error = new restify.NotAuthorizedError();
    error.body.outMsg = sysMsg.SYS_AUTH_TOKEN_ERROR;

    return error;
}

function BadMethodError(msg , outMsg){
    var error = new restify.BadMethodError(msg);
    if(outMsg){
        error.body.outMsg = outMsg;
    }
    return error;
}

function MissingParameterError(msg , outMsg){
    var error = new restify.MissingParameterError(msg);
    if(outMsg){
        error.body.outMsg = outMsg;
    }
    return error;
}

function ResourceNotFoundError(msg , outMsg){
    var error = new restify.ResourceNotFoundError(msg);
    if(outMsg){
        error.body.outMsg = outMsg;
    }
    return error;
}

function InternalError(msg , outMsg){
    var error = new restify.InternalError(msg);
    if(outMsg){
        error.body.outMsg = outMsg;
    }
    return error;
}
module.exports = {
    InvalidArgumentError : InvalidArgumentError ,
    NotAuthorizedError : NotAuthorizedError ,
    MissingParameterError : MissingParameterError ,
    ResourceNotFoundError : ResourceNotFoundError ,
    BadMethodError : BadMethodError,
    InternalError : InternalError
}