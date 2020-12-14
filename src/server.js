const express = require('express');
const app = express();
const logger = require('./common/logger')(__filename);
const db = require('./startup/db');
const configMiddleware = require('./startup/middlewares');
const config = require('./startup/config');

logger.info('Starting server...');

async function connectDB() {
    const dbConnected = await db();
    if (!dbConnected) {
        logger.error('Connection to DB failed. Exiting.');
        process.exit(1);
    }
}
connectDB();

configMiddleware.configure(app);
require('./startup/routes')(app);

const PORT = config.port;

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = server;