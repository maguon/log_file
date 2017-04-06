/**
 * Created by lingxue on 2017/3/29.
 */
var fileDAO = require('../dao/FileDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var resUtil = require('../util/ResponseUtil.js');
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var logger = serverLogger.createLogger('FileBl.js');

function uploadFile(req,res,next){
    var file = req.files.file;
    var params = req.params;
    var metadata ={};
    if(params.fileType){
        metadata.fileType = params.fileType;
    }
    if(params.userType){
        metadata.userType = params.userType;
    }
    if(params.userId){
        metadata.userId = params.userId;
    }
    fileDAO.saveFile(file, metadata,function(error,result){
        if (error) {
            logger.error(' uploadFile ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            var fileObj ={
                id : result
            }
            logger.info(' uploadFile ' + 'success')
            resUtil.resetQueryRes(res, fileObj);
            return next();
        }
    })

}

function getFile(req,res,next){
    var params = req.params;
    fileDAO.getMetaData(params,function(err,col){
        if (err || !col) {
            logger.error(' getFile ' + sysMsg.IMG_QUERY_NO_EXIST + params.imageId);
            return resUtil.resInternalError(err, res, next);
        }

        var etag = req.headers['if-none-match'];
        if (etag && col.md5 && etag == col.md5) {
            res.send(304);
            return next();
        }
        fileDAO.getFile(params, function (err, fstream) {
            if (err) {
                logger.error(' getFile ' + err.message);
                return resUtil.resInternalError(err, res, next);
            }

            res.cache({maxAge: 31536000});
            //res.set("cache-control","no-cache");
            res.set('content-type', col.contentType);
            res.set('last-modified', col.uploadDate);
            res.set('etag', col.md5);
            res.set('content-length', col.length);
            res.writeHead(200);
            fstream.pipe(res);

            fstream.on('error', function(err){
                logger.error(' getFile' + err.message);
                resUtil.resInternalError(error, res, next);
            });
            fstream.on('close', function(){
                logger.info(' getFile ' + params.fileId + ' success');
                return next();
            });
        });

    })

}

function getFileList(req,res,next){
    var params = req.params;
    fileDAO.getMetaData(params,function(err,result){
        if (err) {
            logger.error(' getFileList ' + err.message);
            throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getFileList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    uploadFile : uploadFile ,
    getFile : getFile ,
    getFileList : getFileList
}