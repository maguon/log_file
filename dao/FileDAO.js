/**
 * Created by lingxue on 2017/3/29.
 */
var mongodb = require('./connection/MongoCon.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FileDAO.js');
var fs = require('fs');
var Seq = require('seq');
var ObjectID = require('mongodb').ObjectID;
var GridStore = require('mongodb').GridStore;
var GridFSBucket = require('mongodb').GridFSBucket;


function saveFile(file,metaData,callback){
    if (!file) {
        logger.warn(' saveFile ' + 'File is not found');
        return callback(new Error("File is not found") , null);
    }
    metaData.filename = file.name;
    mongodb.getDb(function (err, db) {
        if (err) {
            logger.error(' saveFile ' + err.message);
            callback(err, null);
            return;
        }
        // file ID, if it has file id override the old one
        var fileId = new ObjectID().toHexString();
        Seq().seq(function(){
            var gridStore = new GridStore(db, fileId, file.name, 'w', {content_type: file.type, metadata: metaData});

            gridStore.open(function (err, gridStore) {
                // Write the file to gridFS
                gridStore.writeFile(file.path, function (err, doc) {
                    if (err) {
                        return callback(err,fileId);
                    } else {
                        fs.unlink(file.path, function (err) {

                        })
                        return callback(null, fileId);
                    }
                });
            })
        })

    });
}

function getMetaData(params, callback) {
    var queryParams  ={};
    if(params.userId){
        queryParams['metadata.userId'] = params.userId;
    }
    if(params.fileType){
        queryParams['metadata.fileType'] = params.fileType;
    }
    if(params.videoType){
        queryParams['metadata.videoType'] = params.videoType;
    }
    if(params.userType){
        queryParams['metadata.userType'] = params.userType;
    }
    if(params.fileId){
        queryParams['_id'] = params.fileId;
    }
    var dateObj ={}
    if(params.startDate){
        dateObj.$gte=new Date(params.startDate) ;
    }
    if(params.endDate){
        dateObj.$lte=new Date(params.endDate) ;
    }
    if(params.startDate!=null ||params.endDate!= null){
        queryParams['uploadDate'] = dateObj;
    }

    mongodb.getDb(function (err, db) {
        if (err) {
            logger.error(' getMetaData ' + err.message);
            //db.close();
            return callback(err, null);
        }
        db.createCollection('fs.files', function (err, collection) {
            if (err) {
                logger.error(' getMetaData ' + err.message);
                return callback(err, null);
            }
            // get meta data
            if(params.start&&params.size){
                collection.find(queryParams).skip(Number.parseInt(params.start)).limit(Number.parseInt(params.size)).toArray(function (err, result) {
                    return callback(err, result);
                });
            } else{
                collection.find(queryParams).toArray(function (err, result) {
                    return callback(err, result);
                });
            }

        });
    });
}
function getFile(params,callback){
    var fileId = params.fileId;
    mongodb.getDb(function (err, db) {
        if (err) {
            logger.error(' getFile ' + err.message);
            db.close();
            return callback(err, null);
        }

        var gridStore = new GridStore(db,fileId, '', "r");
        gridStore.open(function (err, gridStore) {

            if (err) {
                logger.error(' getFile ' + err.message);
                return callback(err, null);
            }
            // Grab the read stream
            var stream = gridStore.stream(true).on('error',function(err){
                logger.warn(' getFile ' + err.message);
                return callback(err, null);
            });
            logger.debug(' getFile ' + fileId +' success');
            return callback(null, stream);

        });
    });
}

function getVideo (params,callback){
    var fileId = params.fileId;
    mongodb.getDb(function (err, db) {
        if (err) {
            logger.error(' getFile ' + err.message);
            db.close();
            return callback(err, null);
        }
        var bucket = new GridFSBucket(db,{chunkSizeBytes:3*1024*1024});
        if(params.start && params.end){
            var stream = bucket.openDownloadStream(fileId,{start:params.start,end:params.end})
        }else{
            var stream = bucket.openDownloadStream(fileId,{start:params.start,end:params.end})
        }

        callback(null,stream)
    });
}
module.exports = {
    saveFile : saveFile ,
    getMetaData : getMetaData ,
    getFile : getFile,
    getVideo : getVideo
}