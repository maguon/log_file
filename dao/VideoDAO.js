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
        var subParams = {};
        if(params.id){
            subParams._id = new ObjectID(params.id)
        }
        if(params.userId){
            subParams.userId = params.userId;
        }
        if(params.md5){
            subParams.md5 = params.md5;
        }
        db.collection('video_meta').find(subParams).toArray(function(err,result){
            callback(err,result)
        })
    })
}

module.exports = {
    saveVideoMetaData , findVideo
}