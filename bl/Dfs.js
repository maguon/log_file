var fdfsDAO = require('../dao/FdfsDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var resUtil = require('../util/ResponseUtil.js');
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var logger = serverLogger.createLogger('Dfs.js');

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
    fdfsDAO.uploadFile(file.path,function(error,result){
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

module.exports = {
    uploadFile:uploadFile,
    deleteFile : deleteFile
}