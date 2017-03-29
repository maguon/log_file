
var loggerConfig = {
    level : 'debug',
    config : {
        appenders: [
            { type: 'console' },
            {
                "type": "file",
                "filename": "../logs/log_file.log",
                "maxLogSize":2048000,
                "backups": 1
            }
        ]
    }
}

var mongoConfig = {
    connect : 'mongodb://localhost:27017/log_file'
}
module.exports = {
    loggerConfig : loggerConfig,
    mongoConfig : mongoConfig
}
