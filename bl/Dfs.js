var Seq = require('seq');
var md5 = require('md5');
var fs = require('fs');
var fdfsDAO = require('../dao/FdfsDAO.js');
var videoDAO = require('../dao/VideoDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var resUtil = require('../util/ResponseUtil.js');
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var logger = serverLogger.createLogger('Dfs.js');


function uploadVideo(req,res,next){
    var video = req.files.video;
    var params = req.params;
    var metadata ={};
    if(params.userId){
        metadata.userId = params.userId;
    }
    metadata.contentType = video.type;
    metadata.size = video.size;
    metadata.filename = video.name;
    metadata.lastModifiedDate = video.lastModifiedDate;
    metadata.uploadDate = new Date().toISOString();
    console.log(metadata);
    console.log(video.path);
    Seq().seq(function(){
        var that = this;
        fs.readFile(video.path, function(err, buf) {
            if(err){
                logger.error(' uploadVideo  md5 ' + error.message);
                resUtil.resInternalError(error, res, next);
                return next();
            }else{
                metadata.md5 =md5(buf);
                that();
            }
        });
    }).seq(function(){
        var that = this;
        fdfsDAO.uploadFile(video.path,function(error,result){
            if (error) {
                logger.error(' uploadVideo video ' + error.message);
                resUtil.resInternalError(error, res, next);
                return next();
            }else{
                fs.unlink(video.path, function (err) {

                })
                metadata.url = result;
                that();
            }
        })
    }).seq(function(){
        var that = this;
        if(req.files.preview){
            fdfsDAO.uploadFile(req.files.preview.path,function(error,result){
                if (error) {
                    logger.error(' uploadVideo preview ' + error.message);
                    resUtil.resInternalError(error, res, next);
                    return next();
                }else{
                    fs.unlink(req.files.preview.path, function (err) {

                    })
                    metadata.preview = result;
                    that();
                }
            })
        }else{
            that();
        }
    }).seq(function(){
        videoDAO.saveVideoMetaData(metadata,function(err,result){
            if (err) {
                logger.error(' uploadVideo preview ' + err.message);
                resUtil.resInternalError(err, res, next);
                return next();
            }else{
                var resObj = {
                    preview : metadata.preview,
                    url : metadata.url
                }
                resUtil.resetQueryRes(res, resObj);
                return next();
            }
        });
    })

}

function deleteFile(req,res,next){
    var fileId = req.params.fileId;
    fdfsDAO.deleteFile(fileId,function(error,result){
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

function getVideoInfo(req,res,next) {
    var params = req.params;
    videoDAO.findVideo(params,function (error,result) {
        if (error) {
            logger.error(' uploadFile ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{

            logger.info(' uploadFile ' + 'success')
            resUtil.resetQueryRes(res, result);
            return next();
        }
    })
}

module.exports = {
    uploadVideo:uploadVideo,
    getVideoInfo : getVideoInfo,
    deleteFile : deleteFile
}