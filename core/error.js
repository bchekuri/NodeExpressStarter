/**
 * Event listener for HTTP server "error" event.
 */
function onError(error, env) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof env.port === 'string'
        ? 'Pipe ' + env.port
        : 'Port ' + env.port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

module.exports = {
    onError
};