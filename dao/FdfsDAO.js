var fdfsCon = require('./connection/FdfsCon.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FdfsDAO.js');
var fs = require('fs');

var uploadFile = function(filePath,callback){
    fdfsCon.getDfs().upload(filePath).then(function(fileId) {
        callback(null,fileId)
    }).catch(function(err) {
        callback(err, null);
    });
}

var deleteFile = function(fileId,callback) {
    fdfsCon.getDfs().del(fileId).then(function() {
        callback(null,{affectRows:1});
    }).catch(function(err) {
        callback(err, null);
    });
}

module.exports = {
    uploadFile :uploadFile ,
    deleteFile :deleteFile
}