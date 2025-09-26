const {createLogger, transports, format} = require("winston");
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new (transports.Console)(),
        new (transports.File)({filename: 'app.log'})
    ],
});

function loggerMiddleware(req, res, next) {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

module.exports = {
    logger,
    loggerMiddleware
};