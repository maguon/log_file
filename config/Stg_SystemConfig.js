
var logLevel = 'DEBUG';
var loggerConfig = {
    appenders: [
        { type: 'console' },
        {
            "type": "file",
            "filename": "../stage/log_file.html",
            "maxLogSize": 2048000,
            "backups": 10
        }
    ]
}


var mongoConfig = {
    connect : 'mongodb://localhost:27017/log_file'
}
module.exports = {
    logLevel : logLevel ,
    loggerConfig : loggerConfig,
    mongoConfig : mongoConfig
}
