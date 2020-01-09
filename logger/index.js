'use strict';

/**********************************************************************
 * Any questions:
 * https://www.npmjs.com/package/winston
 * https://www.npmjs.com/package/winston-daily-rotate-file
 ***********************************************************************/

const winston = require('winston');
const dailyRoateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}:${info.message}`;
        })
    ),
    transports: [
        new dailyRoateFile({
            filename: './log/logger-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});



module.exports = logger;