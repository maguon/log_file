var mongodb = require('./connection/MongoCon.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('VideoDAO.js');
var ObjectID = require('mongodb').ObjectID;

var saveVideoMetaData = function(params,callback){
    mongodb.getDb(function(err,db){
        if (err) {
            logger.error(' saveImage ' + err.message);
            callback(err, null);
            return;
        }
        db.collection('video_meta').save(params,function(err,result){
            callback(err,result)
        })
    })
}
var findVideo = function(params,callback){
    mongodb.getDb(function(err,db){
        if (err) {
            logger.error(' saveImage ' + err.message);
            callback(err, null);
            return;
        }
        db.collection('video_meta').find(params,function(err,result){
            callback(err,result)
        })
    })
}

module.exports = {
    saveVideoMetaData , findVideo
}