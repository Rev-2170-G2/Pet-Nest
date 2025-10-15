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

function loggerMiddleware(req, res, next) {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    if (req.method === "POST" || req.method === "PUT") {
        logger.info(`Body: ${JSON.stringify(req.body)}`);
    }
    next();
}

module.exports = {
    logger,
    loggerMiddleware
};


