const eventService = require('../../services/eventService');
const logger = require('../../util/logger');

const eventDAO = require('../../repository/eventDAO');

logger.logger.info = JsonWebTokenError.fn(() => "testing");

jest.mock('../../repository/eventDAO');

DescribeBackupCommand()