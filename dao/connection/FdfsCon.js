var FdfsClient = require('fastdfs-client');
var serverLogger = require('../../util/ServerLogger.js');
var sysConfig = require('../../config/SystemConfig.js');
var logger = serverLogger.createLogger('FdfsCon.js');

var fdfs = new FdfsClient(
    sysConfig.dfsConfig
)

var getDfs=function (){
    if (fdfs==null){
        logger.info('Init fdfs connection')
        fdfs = new FdfsClient(
            sysConfig.dfsConfig
        )
    }else {
        return fdfs
    }
}
module.exports = {
    getDfs: getDfs
};
