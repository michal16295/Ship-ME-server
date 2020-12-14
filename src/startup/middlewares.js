const morgan = require('morgan');
const middleware = require('../users/middleware');
const logger = require('../common/logger');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

// This will configure all middlewares
module.exports.configure = (app) => {
    app.use(helmet());
    app.use(cors());
    app.use(cookieParser());
    app.use(compression());
    app.use(morgan('tiny', { 'stream': logger.stream }));
    app.use(middleware.tokenValidation);
    app.use(express.json());
}