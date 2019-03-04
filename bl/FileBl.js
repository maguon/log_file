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
            fstream.on('error', function(err){
                logger.error(' getFile' + err.message);
                resUtil.resInternalError(err, res, next);
            });
            fstream.on('close', function(){
                logger.info(' getFile ' + params.fileId + ' success');
                return next();
            });

            res.cache({maxAge: 31536000});
            //res.set("cache-control","no-cache");
            res.set('content-type', col.contentType);
            res.set('last-modified', col.uploadDate);
            res.set('etag', col.md5);
            res.set('content-length', col.length);
            res.writeHead(200);
            fstream.pipe(res);



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

function getVideo(req,res,next){
    var params = req.params;
    fileDAO.getMetaData(params,function(err,col){
        if (err || !col || col.length<1) {
            logger.error(' getFile ' + sysMsg.IMG_QUERY_NO_EXIST + params.fileId);
            return resUtil.resInternalError(err, res, next);
        }

        var etag = req.headers['if-none-match'];
        if (etag && col.md5 && etag == col.md5) {
            res.send(304);
            return next();
        }
        var rangeRequest = readRangeHeader(req.headers['range'], col[0].length);
        console.log(rangeRequest)
        if(rangeRequest !=null){
            var start = rangeRequest.Start;
            var end = rangeRequest.End;
        }
        if (rangeRequest == null ) {
            fileDAO.getVideo(params, function (err, fstream) {
                if (err) {
                    logger.error(' getFile ' + err.message);
                    return resUtil.resInternalError(err, res, next);
                }

                res.cache({maxAge: 31536000});
                res.set('content-type', col[0].contentType);
                res.set('last-modified', col[0].uploadDate);
                res.set('etag', col[0].md5);
                res.set('content-length', col[0].length);
                res.set('Accept-Ranges', 'bytes');
                res.set('Cache-Control', 'no-cache');
                res.writeHead(200);
                fstream.pipe(res);
                fstream.on('error', function(err){
                    logger.error(' getVideo' + err.message);
                    resUtil.resInternalError(error, res, next);
                });
                fstream.on('close', function(){
                    logger.info(' getVideo ' + params.fileId + ' success');
                    return next();
                });
            });
            return;
        }



        // If the range can't be fulfilled.
        if (start >= col[0].length || end >= col[0].length) {
            res.set('Content-Range','bytes 0-'+col[0].length+'/'+col[0].length) ;
            res.writeHead(416);
            return ;
        }
        fileDAO.getVideo({fileId:params.fileId,start:start,end:end}, function (err, fstream) {
            if (err) {
                logger.error(' getFile ' + err.message);
                return resUtil.resInternalError(err, res, next);
            }

            res.cache({maxAge: 31536000});
            res.set('Content-Range','bytes ' + start + '-' + end + '/' + col[0].length) ;
            res.set('content-length', start == end ? 0 : (end - start + 1));
            res.set('content-type', col[0].contentType);
            res.set('Accept-Ranges','bytes')  ;
            res.set('Cache-Control','no-cache') ;
            res.writeHead(206);
            fstream.pipe(res);

            fstream.on('error', function(err){
                logger.error(' getVideo' + err.message);
                resUtil.resInternalError(error, res, next);
            });
            fstream.on('close', function(){
                logger.info(' getVideo ' + params.fileId + ' success');
                return next();
            });
        });

    })

}

function uploadVideo(req,res,next){
    var file = req.files.file;
    var params = req.params;
    var metadata ={};
    if(params.videoType){
        metadata.videoType = params.videoType;
    }
    if(params.userType){
        metadata.userType = params.userType;
    }
    if(params.userId){
        metadata.userId = params.userId;
    }
    fileDAO.saveFile(file, metadata,function(error,result){
        if (error) {
            logger.error(' uploadVideo ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            var fileObj ={
                id : result
            }
            logger.info(' uploadVideo ' + ' success '+result)
            resUtil.resetQueryRes(res, fileObj);
            return next();
        }
    })

}

function readRangeHeader(range, totalLength) {
    /*
     * Example of the method &apos;split&apos; with regular expression.
     *
     * Input: bytes=100-200
     * Output: [null, 100, 200, null]
     *
     * Input: bytes=-200
     * Output: [null, null, 200, null]
     */

    if (range == null || range.length == 0)
        return null;

    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    var start = parseInt(array[1]);
    var end = parseInt(array[2]);
    var result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength - 1) : end
    };

    if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }

    return result;
}
module.exports = {
    uploadFile : uploadFile ,
    getFile : getFile ,
    getFileList : getFileList ,
    uploadVideo : uploadVideo ,
    getVideo : getVideo
}