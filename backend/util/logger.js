const {createLogger, transports, format} = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}\n`;
        })
    ),
    transports: [
        new (transports.Console)(),
        new (transports.File)({filename: 'app.log'})
    ],
});

// const { createLogger, transports, format } = require('winston');
// const { combine, timestamp, prettyPrint } = format; 

// const logger = createLogger({
//     format: combine(
//         timestamp(),
//         prettyPrint()
//     ),
//     transports: [
//         new (transports.Console)({ level: 'info' }),
//         new (transports.File)({
//             name: 'info-file',
//             filename: 'logs/filelog-info.log', // logs/item.log
//             level: 'info'
//         }),
//     ]
// });

function loggerMiddleware(req, res, next) {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

module.exports = {
    logger,
    loggerMiddleware
};


