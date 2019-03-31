/**
 * Health Route
 * @param router
 */
module.exports = function (router) {

    /**
     * Health Method
     */
    router.get('/health', (req, res) =>
        res.send('OK')
    );
};