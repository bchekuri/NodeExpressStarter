
var debug = require('debug')('nodeexpressstarter:app');
var http = require('http');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config');
var error = require('./error');
var routes = require('../routes/index');

/**
 * Add all the routes to express
 * @param app
 */
function initializeRoutes(app) {
    app.use(config.has('apiRoute') ? config.get('apiRoute') : '/api/', routes());
}

/**
 * View Engine Setup
 * @param app
 */
function initializeViewEngineAndAsserts(app) {
    app.set('views',
        path.join(__dirname,
            config.has('express.viewRelativeDir') ? config.get('express.viewRelativeDir') : '..',
            config.has('express.views') ? config.get('express.views') : 'views'));
    app.set('view engine', config.has('express.viewEngine') ? config.get('express.viewEngine') : 'ejs');
    app.use(express.static(path.join(__dirname,
        config.has('express.staticRelativeDir') ? config.get('express.staticRelativeDir') : '..',
        config.has('express.static') ? config.get('express.static') : 'public')));
}

/**
 * Setup Logging for this application
 * @param app
 */
function initializeLogger(app) {
    app.use(logger(config.has('logger.env') ? config.get('logger.env') : 'dev'));
}

/**
 * Setup middleware
 * @param app
 */
function initializeMiddleware(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
}

/**
 * Catch 404 and forward to error handler
 * @param app
 */
function handlePageNotFound(app) {
    app.use(function(req, res, next) {
        next(createError(404));
    });
}

/**
 * Express Error handler
 * @param app
 */
function errorHandler(app) {
    app.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error =
            (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local')  ? err : {};
        res.status(err.status || 500);
        res.render('error.view.ejs');
    });
}

/**
 * Setup Express Handler
 * @returns {*|Function}
 */
function setupExpressHandler() {
    var app = express();
    initializeMiddleware(app);
    initializeLogger(app);
    initializeViewEngineAndAsserts(app);
    initializeRoutes(app);
    handlePageNotFound(app);
    errorHandler(app);
    return app;
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(server) {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

function initializeEnv() {
    var env = {};
    env.port = normalizePort(process.env.PORT || '3000');
    return env;
}

function start() {
    var env = initializeEnv();
    var server = http.createServer(setupExpressHandler());
    server.listen(env.port);
    server.on('error', function (error) {
        error.onError(error, env);
    });
    server.on('listening', function () {
        onListening(server);
    });
};

module.exports = {
    start
}