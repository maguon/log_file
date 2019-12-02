
var logLevel = 'DEBUG';
var loggerConfig = {
    appenders: {
        console: { type: 'console' } ,
        file : {
            "type": "file",
            "filename": "../stage/log_file.html",
            "maxLogSize": 2048000,
            "backups": 10
        }
    },
    categories: { default: { appenders: ['console','file'], level: 'debug' } }
}


var mongoConfig = {
    connect : 'mongodb://localhost:27017/log_file'
}

var dfsConfig ={
    trackers: [
        {
            host: '10.30.44.57',
            port: 22122
        }
    ],
    timeout: 10000
}
module.exports = {
    logLevel : logLevel ,
    loggerConfig : loggerConfig,
    mongoConfig : mongoConfig ,
    dfsConfig :dfsConfig
}
