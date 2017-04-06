
var logLevel = 'DEBUG';
var loggerConfig = {
    level : 'debug',
    config : {
        appenders: [
            { type: 'console' },
            {
                "type": "file",
                "filename": "../stage/log_file.html",
                "maxLogSize":20480,
                "backups": 1
            }
        ]
    }
}

var mongoConfig = {
    connect : 'mongodb://localhost:27017/log_file'
}
module.exports = {
    logLevel : logLevel ,
    loggerConfig : loggerConfig,
    mongoConfig : mongoConfig
}
