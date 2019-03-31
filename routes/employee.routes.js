var employeeController = require('../controllers/employee.controller');


module.exports = function (router) {

    /**
     * Employee list
     */
    router.get('/employee', function(req, res, next) {
        employeeController.getEmployees(req, res);
    });
};
